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
  normal: 'bg-green-50 text-green-700 ring-green-500/20 dark:bg-green-500/10 dark:text-green-400',
  low: 'bg-amber-50 text-amber-700 ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400',
  high: 'bg-red-50 text-red-700 ring-red-500/20 dark:bg-red-500/10 dark:text-red-400',
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
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/10 dark:bg-[#142019] dark:hover:border-white/20"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset transition-transform group-hover:scale-105"
            style={{
              backgroundColor: `${sensor.color}1a`,
              color: sensor.color,
              ringColor: `${sensor.color}30`,
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {sensor.name}
            </p>
            <p className="text-[11px] font-medium text-slate-400">
              {sensor.module}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[status]}`}
        >
          {statusLabel[status]}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
            <span className="ml-1 text-sm font-medium text-slate-400">
              {sensor.unit}
            </span>
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400">
            Live reading
          </p>
        </div>

        {history.length > 1 && (
          <div className="h-11 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient
                    id={`grad-${sensor.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={sensor.color}
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="100%"
                      stopColor={sensor.color}
                      stopOpacity={0}
                    />
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