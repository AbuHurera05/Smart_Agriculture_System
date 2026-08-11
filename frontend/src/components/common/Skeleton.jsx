export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton h-4 rounded-md ${className}`} />
}

export function SkeletonCircle({ size = 40, className = '' }) {
  return (
    <div
      className={`skeleton rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <SkeletonLine className="w-1/3" />
        <SkeletonCircle size={36} />
      </div>
      <SkeletonLine className="w-2/3 h-8" />
      <SkeletonLine className="w-1/2" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="card space-y-3">
      <SkeletonLine className="w-1/4 h-5" />
      <div className="space-y-2 mt-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: cols }).map((_, c) => (
              <SkeletonLine key={c} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonChart({ height = 280 }) {
  return (
    <div className="card">
      <SkeletonLine className="w-1/3 h-5 mb-4" />
      <div className="skeleton rounded-xl" style={{ height }} />
    </div>
  )
}
