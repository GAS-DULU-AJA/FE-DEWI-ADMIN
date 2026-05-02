export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 rounded bg-surface-container-high" />
        <div className="h-4 w-72 rounded bg-surface-container" />
      </div>

      {/* KPI skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border-0 bg-surface-container-lowest p-4">
            <div className="h-3 w-20 rounded bg-surface-container mb-3" />
            <div className="h-7 w-16 rounded bg-surface-container-high mb-2" />
            <div className="h-3 w-24 rounded bg-surface-container" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border-0 bg-surface-container-lowest p-6">
            <div className="h-4 w-32 rounded bg-surface-container-high mb-4" />
            <div className="h-48 rounded bg-surface-container" />
          </div>
        ))}
      </div>
    </div>
  );
}
