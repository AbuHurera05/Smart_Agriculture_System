import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  noPadding = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        rounded-2xl border border-slate-200 bg-white shadow-sm
        dark:border-white/10 dark:bg-[#142019]
        ${noPadding ? '' : 'p-5 sm:p-6'}
        ${hover ? 'cursor-pointer transition-all hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:border-white/20' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { y: -3 } : {}}
      whileTap={hover ? { scale: 0.99 } : {}}
    >
      {children}
    </motion.div>
  )
}