#!/bin/bash
# Create directories
mkdir -p src/app/\(public\)/shop/\[slug\]
mkdir -p src/app/\(public\)/about
mkdir -p src/app/\(public\)/history
mkdir -p src/app/\(public\)/blog/\[slug\]
mkdir -p src/app/\(public\)/contact
mkdir -p src/app/\(public\)/faq
mkdir -p src/app/\(public\)/privacy-policy
mkdir -p src/app/\(public\)/terms
mkdir -p src/app/\(public\)/refund-policy
mkdir -p src/app/\(public\)/shipping-policy
mkdir -p src/app/\(auth\)/sign-in/\[\[...sign-in\]\]
mkdir -p src/app/\(auth\)/sign-up/\[\[...sign-up\]\]
mkdir -p src/app/\(protected\)/profile/addresses
mkdir -p src/app/\(protected\)/profile/orders/\[id\]
mkdir -p src/app/\(protected\)/profile/wishlist
mkdir -p src/app/\(protected\)/checkout
mkdir -p src/app/\(protected\)/order-confirmation/\[id\]
mkdir -p src/app/\(admin\)/admin/products/\[id\]/edit
mkdir -p src/app/\(admin\)/admin/products/new
mkdir -p src/app/\(admin\)/admin/orders/\[id\]
mkdir -p src/app/\(admin\)/admin/users
mkdir -p src/app/\(admin\)/admin/coupons
mkdir -p src/app/api/products/\[id\]
mkdir -p src/app/api/cart
mkdir -p src/app/api/orders
mkdir -p src/app/api/checkout/razorpay
mkdir -p src/app/api/checkout/stripe
mkdir -p src/app/api/checkout/cod
mkdir -p src/app/api/addresses/\[id\]
mkdir -p src/app/api/reviews
mkdir -p src/app/api/wishlist
mkdir -p src/app/api/coupons/validate
mkdir -p src/app/api/admin/products
mkdir -p src/app/api/admin/orders
mkdir -p src/app/api/admin/users
mkdir -p src/components/layout
mkdir -p src/components/product
mkdir -p src/components/cart
mkdir -p src/components/checkout
mkdir -p src/components/home
mkdir -p src/components/profile
mkdir -p src/components/admin
mkdir -p src/components/common
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/context

# Helper function to create empty file
touch_file() {
  touch "$1"
  echo "// TODO: Implement" > "$1"
}

# Create placeholder files
touch_file src/app/\(public\)/page.tsx
touch_file src/app/\(public\)/shop/page.tsx
touch_file src/app/\(public\)/shop/\[slug\]/page.tsx
touch_file src/app/\(public\)/about/page.tsx
touch_file src/app/\(public\)/history/page.tsx
touch_file src/app/\(public\)/blog/page.tsx
touch_file src/app/\(public\)/blog/\[slug\]/page.tsx
touch_file src/app/\(public\)/contact/page.tsx
touch_file src/app/\(public\)/faq/page.tsx
touch_file src/app/\(public\)/privacy-policy/page.tsx
touch_file src/app/\(public\)/terms/page.tsx
touch_file src/app/\(public\)/refund-policy/page.tsx
touch_file src/app/\(public\)/shipping-policy/page.tsx

touch_file src/app/\(auth\)/sign-in/\[\[...sign-in\]\]/page.tsx
touch_file src/app/\(auth\)/sign-up/\[\[...sign-up\]\]/page.tsx

touch_file src/app/\(protected\)/profile/page.tsx
touch_file src/app/\(protected\)/profile/addresses/page.tsx
touch_file src/app/\(protected\)/profile/orders/page.tsx
touch_file src/app/\(protected\)/profile/orders/\[id\]/page.tsx
touch_file src/app/\(protected\)/profile/wishlist/page.tsx
touch_file src/app/\(protected\)/checkout/page.tsx
touch_file src/app/\(protected\)/order-confirmation/\[id\]/page.tsx

touch_file src/app/\(admin\)/admin/layout.tsx
touch_file src/app/\(admin\)/admin/page.tsx
touch_file src/app/\(admin\)/admin/products/page.tsx
touch_file src/app/\(admin\)/admin/products/new/page.tsx
touch_file src/app/\(admin\)/admin/products/\[id\]/edit/page.tsx
touch_file src/app/\(admin\)/admin/orders/page.tsx
touch_file src/app/\(admin\)/admin/orders/\[id\]/page.tsx
touch_file src/app/\(admin\)/admin/users/page.tsx
touch_file src/app/\(admin\)/admin/coupons/page.tsx

touch_file src/app/api/products/route.ts
touch_file src/app/api/products/\[id\]/route.ts
touch_file src/app/api/cart/route.ts
touch_file src/app/api/orders/route.ts
touch_file src/app/api/checkout/razorpay/route.ts
touch_file src/app/api/checkout/stripe/route.ts
touch_file src/app/api/checkout/cod/route.ts
touch_file src/app/api/addresses/route.ts
touch_file src/app/api/addresses/\[id\]/route.ts
touch_file src/app/api/reviews/route.ts
touch_file src/app/api/wishlist/route.ts
touch_file src/app/api/coupons/validate/route.ts
touch_file src/app/api/admin/products/route.ts
touch_file src/app/api/admin/orders/route.ts
touch_file src/app/api/admin/users/route.ts

touch_file src/app/not-found.tsx
touch_file src/app/error.tsx

touch_file src/components/layout/Navbar.tsx
touch_file src/components/layout/Footer.tsx
touch_file src/components/layout/MobileNav.tsx
touch_file src/components/product/ProductCard.tsx
touch_file src/components/product/ProductGrid.tsx
touch_file src/components/product/ProductFilters.tsx
touch_file src/components/product/ProductImages.tsx
touch_file src/components/product/VariantSelector.tsx
touch_file src/components/product/ReviewCard.tsx
touch_file src/components/product/ReviewForm.tsx
touch_file src/components/cart/CartDrawer.tsx
touch_file src/components/cart/CartItem.tsx
touch_file src/components/cart/CartSummary.tsx
touch_file src/components/checkout/AddressSelector.tsx
touch_file src/components/checkout/AddressForm.tsx
touch_file src/components/checkout/PaymentSelector.tsx
touch_file src/components/checkout/OrderSummary.tsx
touch_file src/components/home/Hero.tsx
touch_file src/components/home/FeaturedProducts.tsx
touch_file src/components/home/CategorySection.tsx
touch_file src/components/home/USPSection.tsx
touch_file src/components/home/Testimonials.tsx
touch_file src/components/home/HistoryTeaser.tsx
touch_file src/components/home/NewsletterSignup.tsx
touch_file src/components/profile/OrderCard.tsx
touch_file src/components/profile/AddressCard.tsx
touch_file src/components/profile/WishlistItem.tsx
touch_file src/components/admin/StatsCard.tsx
touch_file src/components/admin/DataTable.tsx
touch_file src/components/admin/RevenueChart.tsx
touch_file src/components/admin/OrderStatusBadge.tsx
touch_file src/components/common/SkeletonCard.tsx
touch_file src/components/common/EmptyState.tsx
touch_file src/components/common/ErrorBoundary.tsx
touch_file src/components/common/CurrencyDisplay.tsx
touch_file src/components/common/RatingStars.tsx
touch_file src/components/common/ImageUpload.tsx

touch_file src/hooks/useCart.ts
touch_file src/hooks/useWishlist.ts
touch_file src/hooks/useAddresses.ts
touch_file src/hooks/useCurrency.ts

touch_file src/types/index.ts

touch_file src/context/CartContext.tsx
touch_file src/context/CurrencyContext.tsx

# Remove default app/page.tsx to avoid conflicts
rm -f src/app/page.tsx

echo "Scaffolding complete!"
