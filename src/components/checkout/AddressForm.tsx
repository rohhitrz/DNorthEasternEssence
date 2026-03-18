"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addressSchema } from "@/lib/validations";

const INITIAL = {
	id: "",
	label: "Home",
	fullName: "",
	email: "",
	phone: "",
	line1: "",
	line2: "",
	city: "",
	state: "",
	country: "IN",
	pincode: "",
};

type AddressFormValues = typeof INITIAL;
type AddressFormInitial = Omit<Partial<AddressFormValues>, "email" | "line2"> & {
	email?: string | null;
	line2?: string | null;
};

export default function AddressForm({
	onSaved,
	initialValues,
	onCancel,
}: {
	onSaved?: () => void;
	initialValues?: AddressFormInitial;
	onCancel?: () => void;
}) {
	const isEditMode = Boolean(initialValues?.id);
	const [form, setForm] = useState<AddressFormValues>({
		...INITIAL,
		...initialValues,
		email: initialValues?.email ?? INITIAL.email,
		line2: initialValues?.line2 ?? INITIAL.line2,
	});
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		setForm({
			...INITIAL,
			...initialValues,
			email: initialValues?.email ?? INITIAL.email,
			line2: initialValues?.line2 ?? INITIAL.line2,
		});
		setErrors({});
	}, [initialValues]);

	return (
		<form
			className="grid gap-2"
			onSubmit={async (event) => {
				event.preventDefault();
				const parsed = addressSchema.safeParse(form);
				if (!parsed.success) {
					const nextErrors: Record<string, string> = {};
					for (const issue of parsed.error.issues) {
						const key = String(issue.path[0] || "form");
						if (!nextErrors[key]) {
							nextErrors[key] = issue.message;
						}
					}
					setErrors(nextErrors);
					toast.error(nextErrors.form || "Please fill a valid shipping address.");
					return;
				}

				setErrors({});
				setSaving(true);
				try {
					const targetId = initialValues?.id || form.id;
					const endpoint = isEditMode ? `/api/addresses/${targetId}` : "/api/addresses";
					const response = await fetch(endpoint, {
						method: isEditMode ? "PATCH" : "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(parsed.data),
					});
					if (!response.ok) {
						let message = "Unable to save address";
						const contentType = response.headers.get("content-type") || "";
						if (contentType.includes("application/json")) {
							const data = (await response.json()) as { error?: string };
							if (data?.error) {
								message = data.error;
							}
						} else {
							const text = await response.text();
							if (text) {
								message = text;
							}
						}
						throw new Error(message);
					}
					setForm(INITIAL);
					onSaved?.();
					toast.success(isEditMode ? "Address updated" : "Address saved");
				} catch (error) {
					toast.error(error instanceof Error ? error.message : "Unable to save address");
				} finally {
					setSaving(false);
				}
			}}
		>
			<Input placeholder="Label" value={form.label} onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))} />
			{errors.label ? <p className="text-xs text-destructive">{errors.label}</p> : null}
			<Input required placeholder="Full Name" value={form.fullName} onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))} />
			{errors.fullName ? <p className="text-xs text-destructive">{errors.fullName}</p> : null}
			<Input
				required
				type="email"
				placeholder="Email (.com)"
				value={form.email}
				onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
			/>
			{errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
			<Input required placeholder="Phone (10 digits)" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value.replace(/\D/g, "").slice(0, 10) }))} />
			{errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
			<Input required placeholder="Address Line 1" value={form.line1} onChange={(event) => setForm((prev) => ({ ...prev, line1: event.target.value }))} />
			{errors.line1 ? <p className="text-xs text-destructive">{errors.line1}</p> : null}
			<Input placeholder="Address Line 2" value={form.line2} onChange={(event) => setForm((prev) => ({ ...prev, line2: event.target.value }))} />
			<div className="grid grid-cols-2 gap-2">
				<Input required placeholder="City" value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} />
				<Input required placeholder="State" value={form.state} onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))} />
			</div>
			{errors.city ? <p className="text-xs text-destructive">{errors.city}</p> : null}
			{errors.state ? <p className="text-xs text-destructive">{errors.state}</p> : null}
			<div className="grid grid-cols-2 gap-2">
				<Input required placeholder="Country Code (IN)" value={form.country} onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value.toUpperCase() }))} maxLength={2} />
				<Input required placeholder="Pincode (6 digits)" value={form.pincode} onChange={(event) => setForm((prev) => ({ ...prev, pincode: event.target.value.replace(/\D/g, "").slice(0, 6) }))} />
			</div>
			{errors.country ? <p className="text-xs text-destructive">{errors.country}</p> : null}
			{errors.pincode ? <p className="text-xs text-destructive">{errors.pincode}</p> : null}
			<div className="flex gap-2">
				<Button type="submit" disabled={saving}>{saving ? "Saving..." : isEditMode ? "Update Address" : "Save Address"}</Button>
				{isEditMode && onCancel ? (
					<Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button>
				) : null}
			</div>
		</form>
	);
}
