import { z } from "zod";

const PHONE_REGEX = /^\d{10}$/;
const PINCODE_REGEX = /^\d{6}$/;

// ── Product Validations ─────────────────────────────

export const productCreateSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z
    .string()
    .min(5, "Short description must be at least 5 characters")
    .max(200),
  category: z.enum(["BAKHOOR", "OUD_OIL", "PERFUME_BLEND"]),
  basePrice: z.number().positive("Price must be positive"),
  compareAtPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  origin: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  scentNotes: z.string().optional().nullable(),
  images: z.array(z.string().url()).default([]),
});

export const productUpdateSchema = productCreateSchema.partial();

// ── Address Validations ─────────────────────────────

const addressBaseSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email")
    .regex(/\.com$/i, "Email must end with .com"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Phone number must be exactly 10 digits"),
  line1: z.string().trim().min(3, "Address line 1 is required").max(120),
  line2: z.string().trim().max(120).optional().nullable(),
  city: z.string().trim().min(2, "City is required").max(60),
  state: z.string().trim().min(2, "State is required").max(60),
  country: z.string().trim().toUpperCase().length(2).default("IN"),
  pincode: z
    .string()
    .trim()
    .regex(PINCODE_REGEX, "Pincode must be exactly 6 digits"),
})

export const addressSchema = addressBaseSchema.extend({
  label: z.string().trim().min(2).max(40).default("Home"),
  isDefault: z.boolean().default(false),
}).superRefine((value, context) => {
  if (value.country === "IN" && !/^\d{6}$/.test(value.pincode)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pincode"],
      message: "Indian pincode must be 6 digits",
    });
  }
});

export const checkoutAddressSchema = addressBaseSchema.pick({
  fullName: true,
  email: true,
  phone: true,
  line1: true,
  line2: true,
  city: true,
  state: true,
  country: true,
  pincode: true,
});

// ── Cart Validations ────────────────────────────────

export const cartItemSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional().nullable(),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const cartUpdateSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

// ── Review Validations ──────────────────────────────

export const reviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional().nullable(),
  comment: z.string().min(10, "Review must be at least 10 characters").max(2000),
});

// ── Order / Checkout Validations ────────────────────

export const checkoutSchema = z.object({
  addressId: z.string().cuid(),
  paymentMethod: z.enum(["RAZORPAY", "STRIPE", "COD"]),
  couponCode: z.string().optional().nullable(),
  idempotencyKey: z.string().min(8).max(128),
  clientTotal: z.number().nonnegative(),
  notes: z.string().max(500).optional().nullable(),
});

// ── Coupon Validations ──────────────────────────────

export const couponCreateSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[A-Z0-9]+$/, "Coupon code must be uppercase alphanumeric"),
  type: z.enum(["PERCENT", "FLAT"]),
  value: z.number().positive("Value must be positive"),
  minOrderValue: z.number().positive().optional().nullable(),
  maxUses: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const couponValidateSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  orderTotal: z.number().nonnegative(),
});

export const imageUploadSchema = z.object({
  files: z
    .array(
      z.object({
        size: z.number().max(5 * 1024 * 1024),
        type: z.enum(["image/jpeg", "image/png", "image/webp"]),
      })
    )
    .max(5),
});

// ── Admin Validations ───────────────────────────────

export const setRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

// ── Contact Form Validation ─────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5).max(100),
  message: z.string().min(10).max(2000),
});

// ── Wishlist Validation ─────────────────────────────

export const wishlistSchema = z.object({
  productId: z.string().cuid(),
});

// ── Type exports ────────────────────────────────────

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CouponCreateInput = z.infer<typeof couponCreateSchema>;
export type SetRoleInput = z.infer<typeof setRoleSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
