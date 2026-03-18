import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cartItemSchema, cartUpdateSchema } from "@/lib/validations";
import { getAuthenticatedUser, handleApiError } from "@/lib/api-helpers";
import { z } from "zod";

const cartBulkSchema = z.object({
	items: z.array(
		z.object({
			productId: z.string().cuid(),
			variantId: z.string().cuid().nullable().optional(),
			quantity: z.number().int().min(1),
		})
	),
});

export async function GET() {
	try {
		const user = await getAuthenticatedUser();
		const cart = await prisma.cart.findMany({
			where: {
				userId: user.id,
				product: { isActive: true },
			},
			select: {
				productId: true,
				variantId: true,
				quantity: true,
				product: {
					select: {
						name: true,
						images: true,
						basePrice: true,
						isActive: true,
					},
				},
				variant: {
					select: {
						label: true,
						priceModifier: true,
					},
				},
			},
		});

		return NextResponse.json({ cart });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await getAuthenticatedUser();
		const body = await req.json();
		const validated = cartItemSchema.parse(body);

		const product = await prisma.product.findUnique({
			where: { id: validated.productId },
			select: { id: true, isActive: true },
		});

		if (!product || !product.isActive) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		if (validated.variantId) {
			const variant = await prisma.productVariant.findFirst({
				where: {
					id: validated.variantId,
					productId: validated.productId,
				},
				select: { id: true },
			});

			if (!variant) {
				return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
			}
		}

		const existing = await prisma.cart.findFirst({
			where: {
				userId: user.id,
				productId: validated.productId,
				variantId: validated.variantId ?? null,
			},
			select: {
				id: true,
				quantity: true,
			},
		});

		const item = existing
			? await prisma.cart.update({
					where: { id: existing.id },
					data: { quantity: existing.quantity + validated.quantity },
					select: {
						id: true,
						productId: true,
						variantId: true,
						quantity: true,
					},
			  })
			: await prisma.cart.create({
					data: {
						userId: user.id,
						productId: validated.productId,
						variantId: validated.variantId ?? null,
						quantity: validated.quantity,
					},
					select: {
						id: true,
						productId: true,
						variantId: true,
						quantity: true,
					},
			  });

		return NextResponse.json({ item }, { status: 201 });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function PATCH(req: NextRequest) {
	try {
		const user = await getAuthenticatedUser();
		const { productId, variantId, quantity } = await req.json();
		const parsed = cartUpdateSchema.parse({ quantity });

		const existing = await prisma.cart.findFirst({
			where: {
				userId: user.id,
				productId,
				variantId: variantId ?? null,
			},
			select: {
				id: true,
			},
		});

		if (!existing) {
			return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
		}

		const item = await prisma.cart.update({
			where: { id: existing.id },
			data: { quantity: parsed.quantity },
			select: {
				id: true,
				productId: true,
				variantId: true,
				quantity: true,
			},
		});

		return NextResponse.json({ item });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const user = await getAuthenticatedUser();
		const body = await req.json();
		const validated = cartBulkSchema.parse(body);

		const productIds = Array.from(new Set(validated.items.map((item) => item.productId)));
		const products = await prisma.product.findMany({
			where: {
				id: { in: productIds },
				isActive: true,
			},
			select: { id: true },
		});
		const validProductIds = new Set(products.map((product) => product.id));

		const variantIds = Array.from(
			new Set(validated.items.map((item) => item.variantId).filter(Boolean) as string[])
		);
		const variants = variantIds.length
			? await prisma.productVariant.findMany({
					where: { id: { in: variantIds } },
					select: { id: true, productId: true },
			  })
			: [];
		const validVariants = new Set(variants.map((variant) => `${variant.id}:${variant.productId}`));

		const safeItems = validated.items.filter((item) => {
			if (!validProductIds.has(item.productId)) {
				return false;
			}

			if (!item.variantId) {
				return true;
			}

			return validVariants.has(`${item.variantId}:${item.productId}`);
		});
		const skippedKeys = validated.items
			.filter((item) => !safeItems.includes(item))
			.map((item) => `${item.productId}:${item.variantId ?? "none"}`);

		await prisma.$transaction(async (tx) => {
			for (const item of safeItems) {
				const existing = await tx.cart.findFirst({
					where: {
						userId: user.id,
						productId: item.productId,
						variantId: item.variantId ?? null,
					},
					select: {
						id: true,
						quantity: true,
					},
				});

				if (existing) {
					await tx.cart.update({
						where: { id: existing.id },
						data: {
							quantity: Math.max(existing.quantity, item.quantity),
						},
					});
				} else {
					await tx.cart.create({
						data: {
							userId: user.id,
							productId: item.productId,
							variantId: item.variantId ?? null,
							quantity: item.quantity,
						},
					});
				}
			}
		});

		return NextResponse.json({ success: true, synced: safeItems.length, skippedKeys });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const user = await getAuthenticatedUser();
		const { productId, variantId } = await req.json();

			await prisma.cart.deleteMany({
				where: {
					userId: user.id,
					productId,
					variantId: variantId ?? null,
				},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		return handleApiError(error);
	}
}
