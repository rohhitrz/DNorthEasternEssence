#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

page_content='export default function Page() { return <main className="p-6 text-foreground">TODO</main>; }'
layout_content='export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }'
route_content='import { NextResponse } from "next/server"; export async function GET() { return NextResponse.json({ message: "TODO" }, { status: 501 }); }'
component_content='export default function Component() { return null; }'
hook_content='export function useHook() { return null; }'

mkdir -p \
  "src/app/(public)/shop/[slug]" \
  "src/app/(public)/about" \
  "src/app/(public)/history" \
  "src/app/(public)/blog/[slug]" \
  "src/app/(public)/contact" \
  "src/app/(public)/faq" \
  "src/app/(public)/privacy-policy" \
  "src/app/(public)/terms" \
  "src/app/(public)/refund-policy" \
  "src/app/(public)/shipping-policy" \
  "src/app/(auth)/sign-in/[[...sign-in]]" \
  "src/app/(auth)/sign-up/[[...sign-up]]" \
  "src/app/(protected)/profile/addresses" \
  "src/app/(protected)/profile/orders/[id]" \
  "src/app/(protected)/profile/wishlist" \
  "src/app/(protected)/checkout" \
  "src/app/(protected)/order-confirmation/[id]" \
  "src/app/(admin)/admin/products/[id]/edit" \
  "src/app/(admin)/admin/products/new" \
  "src/app/(admin)/admin/orders/[id]" \
  "src/app/(admin)/admin/users" \
  "src/app/(admin)/admin/coupons" \
  "src/app/api/products/[id]" \
  "src/app/api/cart" \
  "src/app/api/orders" \
  "src/app/api/checkout/razorpay" \
  "src/app/api/checkout/stripe" \
  "src/app/api/checkout/cod" \
  "src/app/api/addresses/[id]" \
  "src/app/api/reviews" \
  "src/app/api/wishlist" \
  "src/app/api/coupons/validate" \
  "src/app/api/admin/products" \
  "src/app/api/admin/orders" \
  "src/app/api/admin/users" \
  "src/components/layout" \
  "src/components/product" \
  "src/components/cart" \
  "src/components/checkout" \
  "src/components/home" \
  "src/components/profile" \
  "src/components/admin" \
  "src/components/common" \
  "src/hooks" \
  "src/types" \
  "src/context"

pages=(
  "src/app/(public)/page.tsx"
  "src/app/(public)/shop/page.tsx"
  "src/app/(public)/shop/[slug]/page.tsx"
  "src/app/(public)/about/page.tsx"
  "src/app/(public)/history/page.tsx"
  "src/app/(public)/blog/page.tsx"
  "src/app/(public)/blog/[slug]/page.tsx"
  "src/app/(public)/contact/page.tsx"
  "src/app/(public)/faq/page.tsx"
  "src/app/(public)/privacy-policy/page.tsx"
  "src/app/(public)/terms/page.tsx"
  "src/app/(public)/refund-policy/page.tsx"
  "src/app/(public)/shipping-policy/page.tsx"
  "src/app/(auth)/sign-in/[[...sign-in]]/page.tsx"
  "src/app/(auth)/sign-up/[[...sign-up]]/page.tsx"
  "src/app/(protected)/profile/page.tsx"
  "src/app/(protected)/profile/addresses/page.tsx"
  "src/app/(protected)/profile/orders/page.tsx"
  "src/app/(protected)/profile/orders/[id]/page.tsx"
  "src/app/(protected)/profile/wishlist/page.tsx"
  "src/app/(protected)/checkout/page.tsx"
  "src/app/(protected)/order-confirmation/[id]/page.tsx"
  "src/app/(admin)/admin/page.tsx"
  "src/app/(admin)/admin/products/page.tsx"
  "src/app/(admin)/admin/products/new/page.tsx"
  "src/app/(admin)/admin/products/[id]/edit/page.tsx"
  "src/app/(admin)/admin/orders/page.tsx"
  "src/app/(admin)/admin/orders/[id]/page.tsx"
  "src/app/(admin)/admin/users/page.tsx"
  "src/app/(admin)/admin/coupons/page.tsx"
)

for f in "${pages[@]}"; do
  if [[ ! -f "$f" ]]; then
    printf '%s\n' "$page_content" > "$f"
  fi
done

if [[ ! -f "src/app/(admin)/admin/layout.tsx" ]]; then
  printf '%s\n' "$layout_content" > "src/app/(admin)/admin/layout.tsx"
fi

api_routes=(
  "src/app/api/products/route.ts"
  "src/app/api/products/[id]/route.ts"
  "src/app/api/cart/route.ts"
  "src/app/api/orders/route.ts"
  "src/app/api/checkout/razorpay/route.ts"
  "src/app/api/checkout/stripe/route.ts"
  "src/app/api/checkout/cod/route.ts"
  "src/app/api/addresses/route.ts"
  "src/app/api/addresses/[id]/route.ts"
  "src/app/api/reviews/route.ts"
  "src/app/api/wishlist/route.ts"
  "src/app/api/coupons/validate/route.ts"
  "src/app/api/admin/products/route.ts"
  "src/app/api/admin/orders/route.ts"
  "src/app/api/admin/users/route.ts"
)

for f in "${api_routes[@]}"; do
  if [[ ! -f "$f" ]]; then
    printf '%s\n' "$route_content" > "$f"
  fi
done

[[ -f "src/app/not-found.tsx" ]] || printf '%s\n' "$page_content" > "src/app/not-found.tsx"
[[ -f "src/app/error.tsx" ]] || printf '%s\n' '"use client"; export default function Error({ reset }: { error: Error; reset: () => void }) { return <main className="p-6 text-foreground"><p>Something went wrong.</p><button onClick={reset} className="mt-3 rounded-md border px-3 py-2">Try again</button></main>; }' > "src/app/error.tsx"

components=(
  "src/components/layout/Navbar.tsx"
  "src/components/layout/Footer.tsx"
  "src/components/layout/MobileNav.tsx"
  "src/components/product/ProductCard.tsx"
  "src/components/product/ProductGrid.tsx"
  "src/components/product/ProductFilters.tsx"
  "src/components/product/ProductImages.tsx"
  "src/components/product/VariantSelector.tsx"
  "src/components/product/ReviewCard.tsx"
  "src/components/product/ReviewForm.tsx"
  "src/components/cart/CartDrawer.tsx"
  "src/components/cart/CartItem.tsx"
  "src/components/cart/CartSummary.tsx"
  "src/components/checkout/AddressSelector.tsx"
  "src/components/checkout/AddressForm.tsx"
  "src/components/checkout/PaymentSelector.tsx"
  "src/components/checkout/OrderSummary.tsx"
  "src/components/home/Hero.tsx"
  "src/components/home/FeaturedProducts.tsx"
  "src/components/home/CategorySection.tsx"
  "src/components/home/USPSection.tsx"
  "src/components/home/Testimonials.tsx"
  "src/components/home/HistoryTeaser.tsx"
  "src/components/home/NewsletterSignup.tsx"
  "src/components/profile/OrderCard.tsx"
  "src/components/profile/AddressCard.tsx"
  "src/components/profile/WishlistItem.tsx"
  "src/components/admin/StatsCard.tsx"
  "src/components/admin/DataTable.tsx"
  "src/components/admin/RevenueChart.tsx"
  "src/components/admin/OrderStatusBadge.tsx"
  "src/components/common/SkeletonCard.tsx"
  "src/components/common/EmptyState.tsx"
  "src/components/common/ErrorBoundary.tsx"
  "src/components/common/CurrencyDisplay.tsx"
  "src/components/common/RatingStars.tsx"
  "src/components/common/ImageUpload.tsx"
)

for f in "${components[@]}"; do
  if [[ ! -f "$f" ]]; then
    printf '%s\n' "$component_content" > "$f"
  fi
done

for f in src/hooks/useCart.ts src/hooks/useWishlist.ts src/hooks/useAddresses.ts src/hooks/useCurrency.ts; do
  [[ -f "$f" ]] || printf '%s\n' "$hook_content" > "$f"
done

[[ -f "src/types/index.ts" ]] || printf '%s\n' 'export {};' > "src/types/index.ts"

[[ -f "src/context/CartContext.tsx" ]] || printf '%s\n' '"use client"; export function CartContextProvider({ children }: { children: React.ReactNode }) { return children; }' > "src/context/CartContext.tsx"

[[ -f "src/context/CurrencyContext.tsx" ]] || printf '%s\n' '"use client"; import { createContext, useContext, useMemo, useState } from "react"; type Currency = "INR" | "USD"; const CurrencyContext = createContext<{ currency: Currency; setCurrency: (next: Currency) => void } | null>(null); export function CurrencyContextProvider({ children }: { children: React.ReactNode }) { const [currency, setCurrency] = useState<Currency>("INR"); const value = useMemo(() => ({ currency, setCurrency }), [currency]); return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>; } export function useCurrencyContext() { const ctx = useContext(CurrencyContext); if (!ctx) throw new Error("useCurrencyContext must be used within CurrencyContextProvider"); return ctx; }' > "src/context/CurrencyContext.tsx"

echo "Scaffold completed safely"
