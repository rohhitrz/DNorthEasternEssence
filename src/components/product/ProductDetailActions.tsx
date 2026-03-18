"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import { useCart } from "@/hooks/useCart";
import { normalizeImageSrc } from "@/lib/utils";

type ProductDetailActionsProps = {
  product: {
    id: string;
    name: string;
    images: string[];
    basePrice: number;
    stock: number;
  };
};

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { addItem } = useCart();

  const isOutOfStock = product.stock <= 0;
  const heroImage = normalizeImageSrc(product.images[0]);

  const goToSignIn = () => {
    router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname || "/shop")}`);
  };

  const addToCart = () => {
    if (!isSignedIn) {
      goToSignIn();
      return false;
    }

    try {
      addItem({
        productId: product.id,
        variantId: null,
        name: product.name,
        image: heroImage,
        price: product.basePrice,
        quantity: 1,
      });
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add to cart");
      return false;
    }
  };

  return (
    <div className="mt-6 space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Price</p>
        <p className="text-lg font-semibold text-primary">
          <CurrencyDisplay amountInINR={product.basePrice} />
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        {isOutOfStock ? "Currently out of stock" : `${product.stock} in stock`}
      </p>

      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => {
            if (isOutOfStock) {
              return;
            }
            if (addToCart()) {
              toast.success("Added to cart");
            }
          }}
          disabled={isOutOfStock}
        >
          Add to Cart
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            if (isOutOfStock) {
              return;
            }
            if (addToCart()) {
              router.push("/checkout");
            }
          }}
          disabled={isOutOfStock}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
