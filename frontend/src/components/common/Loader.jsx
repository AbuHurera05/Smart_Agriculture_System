export default function Loader({ size = 'md', fullScreen = false, label }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  }

  const loader = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-primary border-t-transparent rounded-full animate-spin`} />
      {label && <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 dark:bg-[#0e1712]/90 flex items-center justify-center z-50">
        {loader}
      </div>
    )
  }

  return loader
}
