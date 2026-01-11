import CategorySkeleton from "./category-skeleton";

function MenuSkeleton() {
  return (
    <main className="space-y-4 flex-1 overflow-hidden pt-3 px-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </main>
  );
}
export default MenuSkeleton;