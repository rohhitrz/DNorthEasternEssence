import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Get the authenticated user from Clerk + DB.
 * Throws 401 if not authenticated, or if user not found in DB.
 */
export async function getAuthenticatedUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new ApiError(401, "Unauthorized: Please sign in.");
  }

  let user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isActive: true,
      role: true,
    },
  });

  if (!user) {
    const clerkUser = await currentUser();
    const primaryEmail = clerkUser?.emailAddresses?.[0]?.emailAddress;

    if (!primaryEmail) {
      throw new ApiError(401, "Unauthorized: User email not available.");
    }

    const displayName = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || null;
    const phone = clerkUser?.phoneNumbers?.[0]?.phoneNumber || null;

    const selectShape = {
      id: true,
      email: true,
      name: true,
      phone: true,
      isActive: true,
      role: true,
    } as const;

    try {
      const existingByEmail = await prisma.user.findUnique({
        where: { email: primaryEmail },
        select: { id: true },
      });

      if (existingByEmail) {
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            clerkId,
            name: displayName,
            phone,
            isActive: true,
          },
          select: selectShape,
        });
      } else {
        user = await prisma.user.upsert({
          where: { clerkId },
          update: {
            email: primaryEmail,
            name: displayName,
            phone,
            isActive: true,
          },
          create: {
            clerkId,
            email: primaryEmail,
            name: displayName,
            phone,
            isActive: true,
          },
          select: selectShape,
        });
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        user = await prisma.user.findFirst({
          where: {
            OR: [{ clerkId }, { email: primaryEmail }],
          },
          select: selectShape,
        });
      } else {
        throw error;
      }
    }
  }

  if (!user) {
    throw new ApiError(500, "Unable to resolve user profile.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Forbidden: Account is inactive.");
  }

  return user;
}

/**
 * Get the authenticated admin user.
 * Throws 401 if not authenticated, 403 if not an admin.
 */
export async function getAdminUser() {
  const user = await getAuthenticatedUser();

  if (user.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden: Admin access required.");
  }

  return user;
}

/**
 * Standardized error response handler for API routes.
 */
export function handleApiError(error: unknown) {
  console.error("[API Error]", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Invalid request data",
        issues: error.issues,
      },
      { status: 400 }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(
      {
        error: "Database request failed",
        code: error.code,
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}

/**
 * Verify Razorpay webhook signature.
 */
export function verifyRazorpaySignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}
