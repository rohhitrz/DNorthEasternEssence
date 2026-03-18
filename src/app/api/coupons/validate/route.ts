import { NextRequest, NextResponse } from "next/server";
import { couponValidateSchema } from "@/lib/validations";
import { getAuthenticatedUser, handleApiError } from "@/lib/api-helpers";
import { validateCouponForUser } from "@/lib/checkout";

export async function POST(req: NextRequest) {
	try {
		const user = await getAuthenticatedUser();
		const body = await req.json();
		const validated = couponValidateSchema.parse(body);

		const { coupon, discount } = await validateCouponForUser({
			code: validated.code,
			userId: user.id,
			orderTotal: validated.orderTotal,
		});

		if (!coupon) {
			return NextResponse.json({ valid: false, discount: 0, message: "Coupon is invalid or unavailable" });
		}

		return NextResponse.json({
			valid: true,
			discount,
			code: coupon.code,
			type: coupon.type,
		});
	} catch (error) {
		return handleApiError(error);
	}
}
