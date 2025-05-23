import { SkeletonCard } from '@/components/ui/skeleton-card';

export default function BannerSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden">
                    <div className="relative h-[200px]">
                        <SkeletonCard
                            width="w-full"
                            height="h-full"
                            direction="vertical"
                        />
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                        </div>
                        <div className="flex gap-2">
                            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse" />
                            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 