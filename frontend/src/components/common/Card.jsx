import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, onClick, noPadding = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card ${noPadding ? '!p-0' : ''} ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      whileHover={hover ? { scale: 1.01 } : {}}
      whileTap={hover ? { scale: 0.99 } : {}}
    >
      {children}
    </motion.div>
  )
}
