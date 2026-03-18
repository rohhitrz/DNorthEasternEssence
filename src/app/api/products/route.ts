import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser, handleApiError } from "@/lib/api-helpers";
import { imageUploadSchema, productCreateSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const page = Math.max(Number(searchParams.get("page") || 1), 1);
		const limit = Math.min(Math.max(Number(searchParams.get("limit") || 12), 1), 48);
		const skip = (page - 1) * limit;

		const products = await prisma.product.findMany({
			where: { isActive: true },
			orderBy: { createdAt: "desc" },
			skip,
			take: limit,
			select: {
				id: true,
				slug: true,
				name: true,
				shortDescription: true,
				category: true,
				basePrice: true,
				compareAtPrice: true,
				images: true,
				stock: true,
				isFeatured: true,
				origin: true,
			},
		});

		return NextResponse.json({
			page,
			limit,
			data: products,
		});
	} catch (error) {
		return handleApiError(error);
	}
}

export async function POST(req: NextRequest) {
	try {
		await getAdminUser();
		const body = await req.json();
		const validated = productCreateSchema.parse(body);

		imageUploadSchema.parse({
			files: validated.images.slice(0, 5).map(() => ({
				size: 1,
				type: "image/webp" as const,
			})),
		});

		const product = await prisma.product.create({
			data: {
				...validated,
				basePrice: validated.basePrice,
				compareAtPrice: validated.compareAtPrice,
			},
			select: {
				id: true,
				slug: true,
				name: true,
			},
		});

		return NextResponse.json({ product }, { status: 201 });
	} catch (error) {
		return handleApiError(error);
	}
}
