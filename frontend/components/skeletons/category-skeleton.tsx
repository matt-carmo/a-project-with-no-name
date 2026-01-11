import ProductSkeleton from "./product-skeleton";

function CategorySkeleton() {
  return (
    <section className="space-y-2">
      <div className="h-5 w-32 bg-zinc-300 rounded animate-pulse mt-4" />

      <div className="grid lg:grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
export default CategorySkeleton;