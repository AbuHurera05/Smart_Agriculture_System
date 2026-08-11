import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

function getStatus(value, thresholds) {
  if (!thresholds) return 'normal'
  if (value < thresholds.low) return 'low'
  if (value > thresholds.high) return 'high'
  return 'normal'
}

const statusStyles = {
  normal: 'badge-success',
  low: 'badge-warning',
  high: 'badge-danger',
}

const statusLabel = {
  normal: 'Optimal',
  low: 'Below range',
  high: 'Above range',
}

export default function SensorCard({ sensor, value, history = [], onClick }) {
  const Icon = Icons[sensor.icon] || Icons.Activity
  const status = getStatus(value, sensor.thresholds)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="card card-hover cursor-pointer flex flex-col"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: `${sensor.color}1a`, color: sensor.color }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{sensor.name}</p>
            <p className="text-xs text-gray-400">{sensor.module}</p>
          </div>
        </div>
        <span className={`badge ${statusStyles[status]}`}>{statusLabel[status]}</span>
      </div>

      <div className="flex items-end justify-between mt-4">
        <p className="text-3xl font-bold tracking-tight">
          {value}
          <span className="text-sm font-medium text-gray-400 ml-1">{sensor.unit}</span>
        </p>
        {history.length > 1 && (
          <div className="w-24 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id={`grad-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sensor.color} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={sensor.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={sensor.color}
                  strokeWidth={2}
                  fill={`url(#grad-${sensor.id})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  )
}
