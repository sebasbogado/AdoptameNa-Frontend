export const SkeletonFilters = ({ numFilters }: { numFilters: number }) => {
  return (
    <div className="w-full px-24">
      <div className="flex flex-wrap gap-8 w-full">
        {[...Array(numFilters)].map((_, index) => (
          <div key={index} className="flex-1 min-w-[300px] flex flex-col gap-2 p-4 bg-white rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-lg w-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};