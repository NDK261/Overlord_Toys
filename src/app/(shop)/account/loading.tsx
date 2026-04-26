// src/app/(shop)/account/loading.tsx
export default function AccountLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-12 space-y-4">
        <div className="h-4 w-48 bg-white/5 rounded-full animate-pulse"></div>
        <div className="h-16 w-96 bg-white/5 rounded-2xl animate-pulse"></div>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-10 border border-white/5 bg-[#0A1010]/50 shadow-2xl">
        <div className="space-y-12">
          {/* Header Skeleton */}
          <div className="space-y-3">
            <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse"></div>
            <div className="h-4 w-80 bg-white/5 rounded-full animate-pulse"></div>
          </div>

          {/* Form Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-3 w-24 bg-white/5 rounded-full animate-pulse"></div>
                <div className="h-14 w-full bg-white/5 rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="h-14 w-48 bg-white/5 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
