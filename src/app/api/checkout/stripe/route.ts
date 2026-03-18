import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutAddressSchema, checkoutSchema } from "@/lib/validations";
import { getAuthenticatedUser, handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { stripe } from "@/lib/stripe";
import {
	assertStock,
	computeTotals,
	createOrderTransaction,
	getPricedCart,
	validateCouponForUser,
} from "@/lib/checkout";

export async function POST(req: NextRequest) {
	try {
		if (!stripe) {
			return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
		}

		const user = await getAuthenticatedUser();
		const rate = checkRateLimit(`checkout:stripe:${user.id}`, RATE_LIMITS.checkout);
		if (!rate.success) {
			return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
		}

		const body = await req.json();
		const payload = checkoutSchema.parse({ ...body, paymentMethod: "STRIPE" });

		const existing = await prisma.order.findFirst({
			where: { userId: user.id, idempotencyKey: payload.idempotencyKey },
			select: {
				id: true,
				total: true,
				status: true,
				paymentStatus: true,
				stripePaymentIntentId: true,
			},
		});

		if (existing) {
			return NextResponse.json({
				reused: true,
				order: {
					id: existing.id,
					total: Number(existing.total),
					status: existing.status,
					paymentStatus: existing.paymentStatus,
				},
				payment: {
					provider: "stripe",
					paymentIntentId: existing.stripePaymentIntentId,
				},
			});
		}

		const address = await prisma.address.findFirst({
			where: { id: payload.addressId, userId: user.id, isDeleted: false },
			select: {
				id: true,
				fullName: true,
				email: true,
				phone: true,
				line1: true,
				line2: true,
				city: true,
				state: true,
				country: true,
				pincode: true,
			},
		});

		if (!address) {
			return NextResponse.json({ error: "Address not found" }, { status: 404 });
		}

		const parsedAddress = checkoutAddressSchema.safeParse(address);
		if (!parsedAddress.success) {
			return NextResponse.json(
				{ error: "Selected address is incomplete. Please update your address before ordering." },
				{ status: 400 }
			);
		}

		const lines = await getPricedCart(user.id);
		if (lines.length === 0) {
			return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
		}

		assertStock(lines);

		const preDiscountTotals = computeTotals(lines, 0);
		const { coupon, discount } = await validateCouponForUser({
			code: payload.couponCode,
			userId: user.id,
			orderTotal: preDiscountTotals.subtotal,
		});
		const totals = computeTotals(lines, discount);

		if (Math.abs(payload.clientTotal - totals.total) > 0.01) {
			return NextResponse.json(
				{
					error: `Price mismatch. Expected ${totals.total.toFixed(2)} but received ${payload.clientTotal.toFixed(2)}.`,
				},
				{ status: 400 }
			);
		}

		const order = await prisma.$transaction(async (tx) =>
			createOrderTransaction({
				tx,
				userId: user.id,
				addressId: address.id,
				addressSnapshot: parsedAddress.data,
				paymentMethod: "STRIPE",
				idempotencyKey: payload.idempotencyKey,
				notes: payload.notes,
				lines,
				subtotal: totals.subtotal,
				shippingCost: totals.shippingCost,
				discount,
				total: totals.total,
				couponId: coupon?.id,
			})
		);

		const paymentIntent = await stripe.paymentIntents.create(
			{
				amount: Math.round(totals.total * 100),
				currency: "usd",
				metadata: {
					orderId: order.id,
					userId: user.id,
				},
			},
			{
				idempotencyKey: payload.idempotencyKey,
			}
		);

		await prisma.order.update({
			where: { id: order.id },
			data: { stripePaymentIntentId: paymentIntent.id },
		});

		return NextResponse.json({
			reused: false,
			order: {
				id: order.id,
				total: Number(order.total),
				status: order.status,
				paymentStatus: order.paymentStatus,
			},
			payment: {
				provider: "stripe",
				paymentIntentClientSecret: paymentIntent.client_secret,
			},
		});
	} catch (error) {
		return handleApiError(error);
	}
}
