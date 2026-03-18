import { ProductGridSkeleton } from "@/components/product/ProductGrid";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-72 animate-pulse rounded bg-muted" />
      </div>
      <ProductGridSkeleton />
    </main>
  );
}
