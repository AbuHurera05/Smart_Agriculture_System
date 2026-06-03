import { motion } from 'framer-motion'

export default function StatsCard({ title, value, icon: Icon, color, trend, unit = '' }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {value}{unit && <span className="text-sm ml-1">{unit}</span>}
          </p>
          {trend && (
            <p className={`text-xs mt-2 ${trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
              {trend} from last hour
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${color}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  )
}