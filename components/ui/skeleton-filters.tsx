export const SkeletonFilters = () => {
  return (
    <div className="flex w-full px-8 justify-center items-center">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {/* Filter 1 */}
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse" />
      </div>

      {/* Filter 2 */}
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse" />
      </div>

      {/* Filter 3 */}
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse" />
      </div>
    </div>
    </div>
  );
};