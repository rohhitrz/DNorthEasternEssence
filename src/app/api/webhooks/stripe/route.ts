import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = checkRateLimit(`webhook:stripe:${ip}`, RATE_LIMITS.webhooks);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
    }

    if (!sig || !secret) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, secret);
    } catch (err) {
      console.error("Stripe webhook verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle payment_intent.succeeded
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
            stripePaymentIntentId: paymentIntent.id,
          },
        });
      }
    }

    // Handle payment_intent.payment_failed
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

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

    // Handle charge.refunded
    if (event.type === "charge.refunded") {
      const charge = event.data.object;
      const paymentIntentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;

      if (paymentIntentId) {
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntentId: paymentIntentId },
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
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
