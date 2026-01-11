function ProductSkeleton() {
  return (
    <div className="flex gap-3 bg-white py-2.5 border-y border-black/5 animate-pulse">
      <div className="h-20 w-20 rounded-lg bg-zinc-200 shrink-0" />

      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-zinc-200 rounded" />
        <div className="h-3 w-full bg-zinc-200 rounded" />
        <div className="h-3 w-1/2 bg-zinc-200 rounded" />
        <div className="h-4 w-20 bg-zinc-300 rounded mt-2" />
      </div>
    </div>
  );
}
export default ProductSkeleton;