export function ItemCardSkeleton() {
  return (
    <div className="flex flex-col md:w-80 w-64 animate-pulse">
      <div className="relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  );
}

export function ProductsGridSkeleton({ itemCount = 12 }: { itemCount?: number }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
      {Array.from({ length: itemCount }).map((_, index) => (
        <ItemCardSkeleton key={index} />
      ))}
    </div>
  );
}