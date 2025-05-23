
type SkeletonCardProps = {
  width?: string;
  height?: string;
  direction?: "vertical" | "horizontal";
};

export const SkeletonCard = ({
  width = "w-[16rem]",
  height = "h-[19rem]",
  direction = "vertical",
}: SkeletonCardProps) => {
  if (direction === "horizontal") {
    return (
      <div
        className={`rounded-3xl bg-gray-200 ${width} ${height} animate-pulse flex flex-row overflow-hidden`}
      >
        <div className="bg-gray-300 w-2/5 h-full rounded-l-3xl" />
        <div className="flex-1 flex flex-col justify-center p-4 gap-2">
          <div className="h-5 bg-gray-300 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl bg-gray-200 ${width} ${height} animate-pulse flex flex-col`}
    >
      <div className="bg-gray-300 h-2/4 w-full rounded-t-3xl" />
      <div className="flex-1 flex flex-col justify-end p-4 gap-2">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-300 rounded w-2/3" />
      </div>
    </div>
  );
};