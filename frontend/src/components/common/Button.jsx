import { motion } from 'framer-motion'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  loadingText = 'Loading...',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = `
    relative inline-flex items-center justify-center gap-2 
    font-semibold tracking-tight 
    transition-all duration-200 ease-out
    cursor-pointer select-none
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-1
    whitespace-nowrap
  `

  const variants = {
    primary: `
      bg-gradient-to-b from-green-500 to-green-600 
      text-white 
      shadow-md shadow-green-600/25 
      hover:shadow-lg hover:shadow-green-600/35 
      hover:from-green-600 hover:to-green-700
      active:from-green-700 active:to-green-800
      focus-visible:ring-green-500/30
    `,
    secondary: `
      bg-slate-100 
      text-slate-700 
      shadow-sm shadow-slate-900/5
      hover:bg-slate-200 
      active:bg-slate-300
      focus-visible:ring-slate-400/30
      dark:bg-slate-800 dark:text-slate-200 
      dark:hover:bg-slate-700
    `,
    danger: `
      bg-gradient-to-b from-red-500 to-red-600 
      text-white 
      shadow-md shadow-red-600/25 
      hover:shadow-lg hover:shadow-red-600/35 
      hover:from-red-600 hover:to-red-700
      active:from-red-700 active:to-red-800
      focus-visible:ring-red-500/30
    `,
    warning: `
      bg-gradient-to-b from-amber-400 to-amber-500 
      text-amber-950 
      shadow-md shadow-amber-500/25 
      hover:shadow-lg hover:shadow-amber-500/35 
      hover:from-amber-500 hover:to-amber-600
      active:from-amber-600 active:to-amber-700
      focus-visible:ring-amber-500/30
    `,
    success: `
      bg-gradient-to-b from-emerald-500 to-emerald-600 
      text-white 
      shadow-md shadow-emerald-600/25 
      hover:shadow-lg hover:shadow-emerald-600/35 
      hover:from-emerald-600 hover:to-emerald-700
      active:from-emerald-700 active:to-emerald-800
      focus-visible:ring-emerald-500/30
    `,
    ghost: `
      bg-transparent 
      text-slate-600 
      hover:bg-slate-100 
      active:bg-slate-200
      focus-visible:ring-slate-400/30
      dark:text-slate-300 
      dark:hover:bg-white/5 
      dark:active:bg-white/10
    `,
    outline: `
      bg-transparent 
      border-2 border-slate-300 
      text-slate-700 
      hover:border-green-500 hover:text-green-600 hover:bg-green-50/50
      active:bg-green-100/50
      focus-visible:ring-green-500/30
      dark:border-slate-700 dark:text-slate-200 
      dark:hover:border-green-500 dark:hover:text-green-400
    `,
  }

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
    sm: 'px-3.5 py-2 text-sm rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-xl gap-2',
    xl: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      whileHover={isDisabled ? {} : { scale: 1.015, y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.985, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        ${baseStyles} 
        ${variants[variant] || variants.primary} 
        ${sizes[size] || sizes.md} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="flex shrink-0 items-center justify-center">
              {leftIcon}
            </span>
          )}
          <span className="truncate">{children}</span>
          {rightIcon && (
            <span className="flex shrink-0 items-center justify-center">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </motion.button>
  )
}