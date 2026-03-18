import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser, handleApiError } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
	try {
		await getAdminUser();
		const { searchParams } = new URL(req.url);
		const page = Math.max(Number(searchParams.get("page") || 1), 1);
		const limit = Math.min(Math.max(Number(searchParams.get("limit") || 20), 1), 100);
		const skip = (page - 1) * limit;

		const data = await prisma.order.findMany({
			orderBy: { createdAt: "desc" },
			skip,
			take: limit,
			select: {
				id: true,
				status: true,
				paymentMethod: true,
				paymentStatus: true,
				total: true,
				currency: true,
				createdAt: true,
				user: {
					select: {
						email: true,
						name: true,
					},
				},
			},
		});

		return NextResponse.json({ page, limit, data });
	} catch (error) {
		return handleApiError(error);
	}
}
