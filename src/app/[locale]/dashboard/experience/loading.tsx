export default function ExperienceLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded bg-stone-200" />
        <div className="h-4 w-72 rounded bg-stone-100" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="h-3 w-16 rounded bg-stone-100 mb-3" />
            <div className="h-7 w-12 rounded bg-stone-200 mb-2" />
            <div className="h-3 w-20 rounded bg-stone-100" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="h-4 w-40 rounded bg-stone-200 mb-3" />
            <div className="h-20 rounded bg-stone-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
