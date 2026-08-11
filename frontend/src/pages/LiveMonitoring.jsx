import { useState } from 'react'
import * as Icons from 'lucide-react'
import { Wifi, WifiOff, AlertTriangle, RadioTower } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import Card from '../components/common/Card'
import { useSensorFeed } from '../hooks/useSensorFeed'
import { sensorDefinitions } from '../utils/constants'

function statusOf(value, thresholds) {
  if (value === undefined) return 'normal'
  if (value < thresholds.low) return 'low'
  if (value > thresholds.high) return 'high'
  return 'normal'
}

export default function LiveMonitoring() {
  const { readings, history, isConnected } = useSensorFeed()
  const [selected, setSelected] = useState(sensorDefinitions[0].id)

  const alerts = sensorDefinitions.filter((s) => statusOf(readings[s.id], s.thresholds) !== 'normal')
  const activeSensor = sensorDefinitions.find((s) => s.id === selected)
  const ActiveIcon = Icons[activeSensor.icon] || Icons.Activity

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Live Monitoring</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">Streaming sensor data updated every few seconds</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${isConnected ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {isConnected ? <Wifi size={15} /> : <WifiOff size={15} />}
          <span className="text-sm font-medium">{isConnected ? 'Connected to gateway' : 'Reconnecting...'}</span>
        </div>
      </div>

      {alerts.length > 0 && (
        <Card className="border-warning/40 bg-warning/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-warning shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-sm">{alerts.length} sensor{alerts.length > 1 ? 's' : ''} outside optimal range</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {alerts.map((a) => a.name).join(', ')} {alerts.length > 1 ? 'need' : 'needs'} attention.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {sensorDefinitions.map((sensor) => {
          const Icon = Icons[sensor.icon] || Icons.Activity
          const status = statusOf(readings[sensor.id], sensor.thresholds)
          const isActive = selected === sensor.id
          return (
            <button
              key={sensor.id}
              onClick={() => setSelected(sensor.id)}
              className={`card !p-3 text-left transition-all ${isActive ? 'ring-2 ring-primary' : 'card-hover'}`}
            >
              <div className="flex items-center justify-between">
                <Icon size={18} style={{ color: sensor.color }} />
                <span className={`w-1.5 h-1.5 rounded-full ${status === 'normal' ? 'bg-success' : status === 'low' ? 'bg-warning' : 'bg-danger'}`} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">{sensor.name}</p>
              <p className="text-lg font-bold">{readings[sensor.id]}<span className="text-xs font-normal text-gray-400 ml-0.5">{sensor.unit}</span></p>
            </button>
          )
        })}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${activeSensor.color}1a`, color: activeSensor.color }}>
              <ActiveIcon size={20} />
            </div>
            <div>
              <h3 className="font-semibold">{activeSensor.name}</h3>
              <p className="text-xs text-gray-400">{activeSensor.module}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <RadioTower size={13} /> live feed
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={history[selected] || []}>
            <defs>
              <linearGradient id="liveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeSensor.color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={activeSensor.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[activeSensor.min, activeSensor.max]} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={activeSensor.color} strokeWidth={2} fill="url(#liveGrad)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{activeSensor.description}</p>
      </Card>
    </div>
  )
}
