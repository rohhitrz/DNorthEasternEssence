import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, handleApiError } from "@/lib/api-helpers";
import { reviewSchema } from "@/lib/validations";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
	try {
		const user = await getAuthenticatedUser();

		const rate = checkRateLimit(`reviews:${user.id}`, RATE_LIMITS.reviews);
		if (!rate.success) {
			return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
		}

		const body = await req.json();
		const validated = reviewSchema.parse(body);

		const hasDeliveredPurchase = await prisma.order.findFirst({
			where: {
				userId: user.id,
				status: "DELIVERED",
				items: {
					some: {
						productId: validated.productId,
					},
				},
			},
			select: { id: true },
		});

		if (!hasDeliveredPurchase) {
			return NextResponse.json(
				{ error: "Only customers with delivered orders can review this product" },
				{ status: 403 }
			);
		}

		const review = await prisma.review.upsert({
			where: {
				userId_productId: {
					userId: user.id,
					productId: validated.productId,
				},
			},
			update: {
				rating: validated.rating,
				title: validated.title,
				comment: validated.comment,
				isVerified: true,
			},
			create: {
				userId: user.id,
				productId: validated.productId,
				rating: validated.rating,
				title: validated.title,
				comment: validated.comment,
				isVerified: true,
			},
			select: {
				id: true,
				rating: true,
				title: true,
				comment: true,
				createdAt: true,
			},
		});

		return NextResponse.json({ review }, { status: 201 });
	} catch (error) {
		return handleApiError(error);
	}
}
