import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations";
import { getAuthenticatedUser, handleApiError } from "@/lib/api-helpers";

export async function GET() {
	try {
		const user = await getAuthenticatedUser();
		const addresses = await prisma.address.findMany({
			where: { userId: user.id, isDeleted: false },
			orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
			select: {
				id: true,
				label: true,
				fullName: true,
				email: true,
				phone: true,
				line1: true,
				line2: true,
				city: true,
				state: true,
				country: true,
				pincode: true,
				isDefault: true,
			},
		});

		return NextResponse.json({ addresses });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await getAuthenticatedUser();
		const body = await req.json();
		const validated = addressSchema.parse(body);

		const address = await prisma.address.create({
			data: {
				userId: user.id,
				...validated,
			},
			select: {
				id: true,
				label: true,
				fullName: true,
				email: true,
				phone: true,
				line1: true,
				line2: true,
				city: true,
				state: true,
				country: true,
				pincode: true,
				isDefault: true,
			},
		});

		return NextResponse.json({ address }, { status: 201 });
	} catch (error) {
		return handleApiError(error);
	}
}
