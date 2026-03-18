import { Prisma, type Coupon } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FREE_SHIPPING_THRESHOLD_INR, SHIPPING_COST_INR } from "@/lib/constants";

export type PricedCartLine = {
  productId: string;
  variantId: string | null;
  name: string;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  productStock: number;
  variantStock: number | null;
};

export async function getPricedCart(userId: string): Promise<PricedCartLine[]> {
  const cartLines = await prisma.cart.findMany({
    where: { userId },
    select: {
      quantity: true,
      productId: true,
      variantId: true,
      product: {
        select: {
          name: true,
          basePrice: true,
          stock: true,
          isActive: true,
        },
      },
      variant: {
        select: {
          label: true,
          priceModifier: true,
          stock: true,
        },
      },
    },
  });

  return cartLines
    .filter((line) => line.product.isActive)
    .map((line) => {
      const base = Number(line.product.basePrice);
      const modifier = line.variant ? Number(line.variant.priceModifier) : 0;
      return {
        productId: line.productId,
        variantId: line.variantId,
        name: line.product.name,
        variantLabel: line.variant?.label ?? null,
        quantity: line.quantity,
        unitPrice: Number((base + modifier).toFixed(2)),
        productStock: line.product.stock,
        variantStock: line.variant?.stock ?? null,
      };
    });
}

export function computeTotals(lines: PricedCartLine[], discount: number) {
  const subtotal = Number(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0).toFixed(2));
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : SHIPPING_COST_INR;
  const total = Number((subtotal + shippingCost - discount).toFixed(2));

  return {
    subtotal,
    shippingCost,
    total,
  };
}

export async function validateCouponForUser(params: {
  code?: string | null;
  userId: string;
  orderTotal: number;
}): Promise<{ coupon: Coupon | null; discount: number }> {
  if (!params.code) {
    return { coupon: null, discount: 0 };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: params.code.toUpperCase() },
    select: {
      id: true,
      code: true,
      type: true,
      value: true,
      minOrderValue: true,
      maxUses: true,
      usedCount: true,
      expiresAt: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!coupon || !coupon.isActive) {
    return { coupon: null, discount: 0 };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { coupon: null, discount: 0 };
  }

  if (coupon.maxUses !== null && coupon.maxUses !== undefined && coupon.usedCount >= coupon.maxUses) {
    return { coupon: null, discount: 0 };
  }

  if (coupon.minOrderValue && params.orderTotal < Number(coupon.minOrderValue)) {
    return { coupon: null, discount: 0 };
  }

  const priorUsage = await prisma.couponUsage.findFirst({
    where: {
      userId: params.userId,
      couponId: coupon.id,
    },
    select: { id: true },
  });

  if (priorUsage) {
    return { coupon: null, discount: 0 };
  }

  const discount =
    coupon.type === "PERCENT"
      ? Number(((params.orderTotal * Number(coupon.value)) / 100).toFixed(2))
      : Number(coupon.value);

  return {
    coupon,
    discount: Math.min(discount, params.orderTotal),
  };
}

export function assertStock(lines: PricedCartLine[]) {
  for (const line of lines) {
    if (line.variantId && line.variantStock !== null && line.quantity > line.variantStock) {
      throw new Error(`Variant stock unavailable for ${line.name}`);
    }

    if (line.quantity > line.productStock) {
      throw new Error(`Stock unavailable for ${line.name}`);
    }
  }
}

export async function createOrderTransaction(params: {
  tx: Prisma.TransactionClient;
  userId: string;
  addressId: string;
  addressSnapshot: Prisma.InputJsonValue;
  paymentMethod: "RAZORPAY" | "STRIPE" | "COD";
  idempotencyKey: string;
  notes?: string | null;
  lines: PricedCartLine[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponId?: string;
}) {
  for (const line of params.lines) {
    await params.tx.product.update({
      where: { id: line.productId },
      data: { stock: { decrement: line.quantity } },
    });

    if (line.variantId) {
      await params.tx.productVariant.update({
        where: { id: line.variantId },
        data: { stock: { decrement: line.quantity } },
      });
    }
  }

  const order = await params.tx.order.create({
    data: {
      userId: params.userId,
      addressId: params.addressId,
      addressSnapshot: params.addressSnapshot,
      paymentMethod: params.paymentMethod,
      idempotencyKey: params.idempotencyKey,
      notes: params.notes,
      subtotal: params.subtotal,
      shippingCost: params.shippingCost,
      discount: params.discount,
      total: params.total,
      currency: "INR",
      items: {
        create: params.lines.map((line) => ({
          productId: line.productId,
          variantId: line.variantId,
          productName: line.name,
          variantLabel: line.variantLabel,
          price: line.unitPrice,
          quantity: line.quantity,
        })),
      },
    },
    select: {
      id: true,
      total: true,
      paymentStatus: true,
      status: true,
    },
  });

  if (params.couponId) {
    await params.tx.couponUsage.create({
      data: {
        couponId: params.couponId,
        userId: params.userId,
        orderId: order.id,
      },
    });

    await params.tx.coupon.update({
      where: { id: params.couponId },
      data: { usedCount: { increment: 1 } },
    });
  }

  await params.tx.cart.deleteMany({ where: { userId: params.userId } });

  return order;
}
