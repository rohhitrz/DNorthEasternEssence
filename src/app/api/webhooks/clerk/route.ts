import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const eventType = evt.type;

  // Handle user.created
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, phone_numbers } =
      evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address;
    if (!primaryEmail) {
      return NextResponse.json(
        { error: "No email found" },
        { status: 400 }
      );
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || null;
    const phone = phone_numbers?.[0]?.phone_number || null;

    await prisma.user.upsert({
      where: { clerkId: id },
      create: {
        clerkId: id,
        email: primaryEmail,
        name,
        phone,
        isActive: true,
      },
      update: {
        email: primaryEmail,
        name,
        phone,
        isActive: true,
      },
    });

    console.log(`✅ User created in DB: ${primaryEmail}`);
  }

  // Handle user.updated
  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, phone_numbers } =
      evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ") || null;
    const phone = phone_numbers?.[0]?.phone_number || null;

    await prisma.user
      .update({
        where: { clerkId: id },
        data: {
          ...(primaryEmail && { email: primaryEmail }),
          name,
          phone,
          isActive: true,
        },
      })
      .catch(async () => {
        if (!primaryEmail) {
          return;
        }

        await prisma.user.create({
          data: {
            clerkId: id,
            email: primaryEmail,
            name,
            phone,
            isActive: true,
          },
        });
      });

    console.log(`✅ User updated in DB: ${id}`);
  }

  // Handle user.deleted
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (id) {
      await prisma.user
        .update({
          where: { clerkId: id },
          data: { isActive: false },
        })
        .catch(() => {
          console.warn(`User ${id} not found in DB for soft deletion`);
        });

      console.log(`✅ User soft-deleted in DB: ${id}`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
