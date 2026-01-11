function StoreHeaderSkeleton() {
  return (
    <header className="bg-primary">
      <div className="bg-primary/90 pt-1.5 px-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-white/40 animate-pulse" />
          <div className="h-3 w-24 bg-white/40 rounded animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-12 h-12 rounded-full bg-white/50 animate-pulse" />

        <div className="flex flex-col gap-1">
          <div className="h-4 w-40 bg-white/50 rounded animate-pulse" />
          <div className="h-3 w-28 bg-white/30 rounded animate-pulse" />
        </div>
      </div>
    </header>
  );
}
export default StoreHeaderSkeleton;