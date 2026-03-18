import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { wishlistSchema } from "@/lib/validations";
import { getAuthenticatedUser, handleApiError } from "@/lib/api-helpers";

export async function GET() {
	try {
		const user = await getAuthenticatedUser();
		const items = await prisma.wishlist.findMany({
			where: { userId: user.id },
			orderBy: { addedAt: "desc" },
			select: {
				id: true,
				product: {
					select: {
						id: true,
						slug: true,
						name: true,
						images: true,
						basePrice: true,
						compareAtPrice: true,
					},
				},
			},
		});

		return NextResponse.json({ items });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await getAuthenticatedUser();
		const body = await req.json();
		const { productId } = wishlistSchema.parse(body);

		const product = await prisma.product.findUnique({
			where: { id: productId },
			select: { id: true, isActive: true },
		});

		if (!product || !product.isActive) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		const item = await prisma.wishlist.upsert({
			where: { userId_productId: { userId: user.id, productId } },
			update: {},
			create: {
				userId: user.id,
				productId,
			},
			select: {
				id: true,
				productId: true,
			},
		});

		return NextResponse.json({ item }, { status: 201 });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const user = await getAuthenticatedUser();
		const body = await req.json();
		const { productId } = wishlistSchema.parse(body);

		await prisma.wishlist.deleteMany({
			where: {
				userId: user.id,
				productId,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		return handleApiError(error);
	}
}
