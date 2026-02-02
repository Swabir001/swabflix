export function SkeletonLoader() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-[70vw] sm:h-[56.25vw] min-h-[400px] sm:min-h-[500px] w-full bg-gray-800/50">
        <div className="absolute bottom-0 left-0 p-4 md:p-12 space-y-3 sm:space-y-4 w-full max-w-2xl">
          <div className="h-8 sm:h-10 md:h-16 bg-gray-700/50 rounded w-3/4" />
          <div className="h-3 sm:h-4 bg-gray-700/50 rounded w-1/2" />
          <div className="h-3 sm:h-4 bg-gray-700/50 rounded w-2/3" />
          <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
            <div className="h-8 sm:h-10 w-24 sm:w-28 bg-gray-700/50 rounded" />
            <div className="h-8 sm:h-10 w-28 sm:w-32 bg-gray-700/50 rounded" />
          </div>
        </div>
      </div>

      {/* Category rows skeleton */}
      <div className="space-y-8 sm:space-y-12 px-4 md:px-12 -mt-12 sm:-mt-24 relative z-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2 sm:space-y-3">
            <div className="h-5 sm:h-6 w-36 sm:w-48 bg-gray-700/50 rounded" />
            <div className="flex gap-2 sm:gap-3 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div
                  key={j}
                  className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] aspect-video bg-gray-800/50 rounded-md"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
