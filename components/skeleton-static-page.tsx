import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonStaticPage() {
    return (
        <div className="w-full px-12">
            {/* Hero Image Skeleton */}
            <Skeleton className="w-full h-[300px] rounded-lg" />

            <div className="max-w-3xl mx-auto py-8 px-4">

                {/* Title Skeleton */}
                <Skeleton className="h-8 w-3/4 mx-auto mb-8" />

                {/* Content Skeleton */}
                <div className="space-y-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />

                    <div className="space-y-2">
                        <Skeleton className="h-6 w-1/3" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-6 w-1/3" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>
                    </div>
                </div>

                {/* Second Title Skeleton */}
                <Skeleton className="h-8 w-3/4 mx-auto mt-12 mb-8" />

                {/* Second Content Skeleton */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                            <Skeleton className="h-4 w-3/6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 