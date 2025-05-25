import { ChevronLeft, ChevronRight } from "lucide-react";

export function SkeletonBanner({ height = "h-[8rem]" }) {
  return (
    <div className={`w-full ${height} bg-gray-200 relative rounded-xl overflow-hidden animate-pulse`}>
     {/* Flecha izquierda */}
<div className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
    <ChevronLeft className="text-gray-600 w-8 h-8" />
</div>

{/* Flecha derecha */}
<div className="absolute top-1/2 -translate-y-1/2 right-4 z-10">
    <ChevronRight className="text-gray-600 w-8 h-8" />
</div>

      {/* Dots del carousel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="w-3 h-3 rounded-full bg-gray-600"
            style={{ opacity: idx === 0 ? 1 : 0.6 }}
          />
        ))}
      </div>
    </div>
  );
}