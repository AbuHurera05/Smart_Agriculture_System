import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const tones = {
  green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400',
}

export default function StatsCard({ title, value, icon: Icon, tone = 'green', trend, unit = '' }) {
  const isUp = trend?.startsWith('+')
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card card-hover"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{title}</p>
          <p className="text-2xl font-bold mt-1 tracking-tight">
            {value}{unit && <span className="text-sm font-medium ml-1 text-gray-400">{unit}</span>}
          </p>
          {trend && (
            <p className={`text-xs mt-2 inline-flex items-center gap-1 font-medium ${isUp ? 'text-success' : 'text-danger'}`}>
              {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {trend} vs last hour
            </p>
          )}
        </div>
        <div className={`p-3 rounded-2xl shrink-0 ${tones[tone] || tones.green}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}
