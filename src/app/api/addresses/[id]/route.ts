import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations";
import { getAuthenticatedUser, handleApiError } from "@/lib/api-helpers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const user = await getAuthenticatedUser();
		const body = await req.json();
		const validated = addressSchema.partial().parse(body);

		const existing = await prisma.address.findFirst({
			where: { id: params.id, userId: user.id, isDeleted: false },
			select: { id: true },
		});

		if (!existing) {
			return NextResponse.json({ error: "Address not found" }, { status: 404 });
		}

		const address = await prisma.address.update({
			where: { id: existing.id },
			data: validated,
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

		return NextResponse.json({ address });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
	try {
		const user = await getAuthenticatedUser();

		const existing = await prisma.address.findFirst({
			where: { id: params.id, userId: user.id, isDeleted: false },
			select: { id: true },
		});

		if (!existing) {
			return NextResponse.json({ error: "Address not found" }, { status: 404 });
		}

		const linkedOrder = await prisma.order.findFirst({
			where: { addressId: existing.id, userId: user.id },
			select: { id: true },
		});

		if (linkedOrder) {
			await prisma.address.update({
				where: { id: existing.id },
				data: { isDeleted: true, isDefault: false },
			});

			return NextResponse.json({ success: true, softDeleted: true });
		}

		await prisma.address.delete({ where: { id: existing.id } });
		return NextResponse.json({ success: true, softDeleted: false });
	} catch (error) {
		return handleApiError(error);
	}
}
