import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature, handleApiError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = checkRateLimit(`webhook:razorpay:${ip}`, RATE_LIMITS.webhooks);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = verifyRazorpaySignature(body, signature, secret);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle payment.captured
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.notes?.orderId;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
            razorpayPaymentId: payment.id,
          },
        });
      }
    }

    // Handle payment.failed
    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const orderId = payment.notes?.orderId;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "FAILED",
            status: "CANCELLED",
          },
        });
      }
    }

    // Handle refund.created
    if (event.event === "refund.created") {
      const refund = event.payload.refund.entity;
      const paymentId = refund.payment_id;

      const order = await prisma.order.findFirst({
        where: { razorpayPaymentId: paymentId },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "REFUNDED",
            status: "REFUNDED",
          },
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
