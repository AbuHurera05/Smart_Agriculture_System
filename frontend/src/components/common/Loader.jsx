export default function Loader({ size = 'md', fullScreen = false }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }
  
  const loader = (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`} />
    </div>
  )
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {loader}
      </div>
    )
  }
  
  return loader
}