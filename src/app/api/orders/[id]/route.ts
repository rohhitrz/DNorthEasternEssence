import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, handleApiError } from "@/lib/api-helpers";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
	try {
		const user = await getAuthenticatedUser();

		const order = await prisma.order.findFirst({
			where: {
				id: params.id,
				userId: user.id,
			},
			select: {
				id: true,
				status: true,
				paymentMethod: true,
				paymentStatus: true,
				subtotal: true,
				shippingCost: true,
				discount: true,
				total: true,
				currency: true,
				createdAt: true,
				addressSnapshot: true,
				items: {
					select: {
						id: true,
						productId: true,
						productName: true,
						variantLabel: true,
						price: true,
						quantity: true,
						product: {
							select: {
								slug: true,
								images: true,
							},
						},
					},
				},
			},
		});

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		return NextResponse.json({ order });
	} catch (error) {
		return handleApiError(error);
	}
}
