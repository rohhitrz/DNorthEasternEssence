import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser, handleApiError } from "@/lib/api-helpers";
import { productUpdateSchema } from "@/lib/validations";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
	try {
		const product = await prisma.product.findUnique({
			where: { id: params.id },
			select: {
				id: true,
				slug: true,
				name: true,
				shortDescription: true,
				description: true,
				category: true,
				basePrice: true,
				compareAtPrice: true,
				images: true,
				stock: true,
				isActive: true,
			},
		});

		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json({ product });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		await getAdminUser();
		const body = await req.json();
		const validated = productUpdateSchema.parse(body);

		const product = await prisma.product.update({
			where: { id: params.id },
			data: validated,
			select: {
				id: true,
				name: true,
				slug: true,
			},
		});

		return NextResponse.json({ product });
	} catch (error) {
		return handleApiError(error);
	}
}
