import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, handleApiError } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
	try {
		const user = await getAuthenticatedUser();
		const { searchParams } = new URL(req.url);
		const page = Math.max(Number(searchParams.get("page") || 1), 1);
		const limit = Math.min(Math.max(Number(searchParams.get("limit") || 10), 1), 50);
		const skip = (page - 1) * limit;

		const orders = await prisma.order.findMany({
			where: { userId: user.id },
			orderBy: { createdAt: "desc" },
			skip,
			take: limit,
			select: {
				id: true,
				status: true,
				paymentMethod: true,
				paymentStatus: true,
				subtotal: true,
				total: true,
				currency: true,
				createdAt: true,
				items: {
					select: {
						productId: true,
						productName: true,
						quantity: true,
						price: true,
						product: {
							select: {
								slug: true,
							},
						},
					},
				},
			},
		});

		return NextResponse.json({ page, limit, data: orders });
	} catch (error) {
		return handleApiError(error);
	}
}
