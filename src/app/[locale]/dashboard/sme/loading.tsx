export default function SmeLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-44 rounded bg-surface-container-high" />
        <div className="h-4 w-64 rounded bg-surface-container" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border-0 bg-surface-container-lowest p-3 text-center">
            <div className="mx-auto h-7 w-8 rounded bg-surface-container-high mb-2" />
            <div className="mx-auto h-3 w-16 rounded bg-surface-container" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border-0 bg-surface-container-lowest p-4">
            <div className="h-10 w-10 rounded-lg bg-surface-container mb-3" />
            <div className="h-4 w-32 rounded bg-surface-container-high mb-2" />
            <div className="h-3 w-20 rounded bg-surface-container mb-2" />
            <div className="h-3 w-full rounded bg-surface-container" />
          </div>
        ))}
      </div>
    </div>
  );
}
