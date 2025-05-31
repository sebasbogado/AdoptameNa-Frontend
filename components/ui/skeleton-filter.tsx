export const SkeletonFilters = ({ numFilters, maxWidth = "max-w-7xl" }: { numFilters: number, maxWidth?: string }) => {
    const getGridCols = () => {
        if (numFilters <= 2) return "grid-cols-1 md:grid-cols-2";
        if (numFilters <= 4) return "grid-cols-2 md:grid-cols-2 lg:grid-cols-4";
        return "grid-cols-2 md:grid-cols-2 lg:grid-cols-5";
    };

    return (
        <div className={`w-full ${maxWidth} mx-auto px-4 md:px-0`}>
            <div className={`grid ${getGridCols()} gap-6`}>
                {[...Array(numFilters)].map((_, index) => (
                    <div key={index} className="flex flex-col gap-2 p-4 bg-white rounded-lg">
                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                        <div className="h-10 bg-gray-100 rounded-lg w-full animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
};