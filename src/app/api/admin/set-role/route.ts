import { NextRequest, NextResponse } from "next/server";
import { getAdminUser, handleApiError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { setRoleSchema } from "@/lib/validations";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // Only admins can set roles
    await getAdminUser();

    const body = await req.json();
    const validated = setRoleSchema.parse(body);

    // Update role in database
    const user = await prisma.user.update({
      where: { id: validated.userId },
      data: { role: validated.role },
      select: { id: true, clerkId: true, email: true, role: true },
    });

    // Update role in Clerk public metadata to keep in sync
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.clerkId, {
      publicMetadata: {
        role: validated.role,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
