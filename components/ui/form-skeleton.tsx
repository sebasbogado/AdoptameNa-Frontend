import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-auto">
      {/* Background with overlay */}
      <div
        className="fixed inset-0 -z-50"
        style={{
          backgroundImage: `url('/andrew-s-ouo1hbizWwo-unsplash.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-lilac-background opacity-60"></div>
      </div>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-16 bg-white rounded-3xl shadow-lg overflow-y-auto my-24">
        {/* Header */}
        <div className="flex items-center gap-2 mb-16">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="h-8 w-48" />
        </div>

        {/* Banner Section */}
        <div className="p-4 w-full max-w-5xl rounded-lg">
          <div className="relative">
            <Skeleton className="w-full h-[400px] rounded-lg" />
          </div>
          <div className="flex gap-2 mt-2 justify-center items-center">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="w-24 h-24 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <section className="p-8">
          <div className="flex flex-col gap-6">
            {/* Select Fields */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="w-1/3 mb-2">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            {/* Text Input Fields */}
            {[...Array(2)].map((_, index) => (
              <div key={index} className="mb-2">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            {/* Date Input */}
            <div className="mb-2">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-10 w-1/5" />
            </div>

            {/* Radio Buttons */}
            <div className="flex gap-4 items-center mb-2">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>

            {/* Checkboxes */}
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}

            {/* Map */}
            <div className="h-[400px] relative">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-6 gap-10">
              <Skeleton className="h-10 w-40" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 