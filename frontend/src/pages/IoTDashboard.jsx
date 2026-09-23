import { useEffect, useState } from 'react'
import { Activity, Wifi, WifiOff, Gauge, ShieldCheck, Zap } from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import StatsCard from '../components/dashboard/StatsCard'
import SensorCard from '../components/dashboard/SensorCard'
import WeatherWidget from '../components/dashboard/WeatherWidget'
import CropStatus from '../components/dashboard/CropStatus'
import Card from '../components/common/Card'
import { SkeletonCard, SkeletonChart } from '../components/common/Skeleton'
import { useSensorFeed } from '../hooks/useSensorFeed'
import { sensorDefinitions } from '../utils/constants'

export default function IoTDashboard() {
  const { readings, history, isConnected } = useSensorFeed()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const combinedTrend =
    history.soilMoisture?.map((point, i) => ({
      time: point.time,
      moisture: point.value,
      temperature: history.temperature?.[i]?.value,
      humidity: history.humidity?.[i]?.value,
    })) || []

  const activeAlerts = sensorDefinitions.filter((s) => {
    const v = readings[s.id]
    return v !== undefined && (v < s.thresholds.low || v > s.thresholds.high)
  }).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonChart />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Farm Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Real-time sensor monitoring across your fields
          </p>
        </div>
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold ring-1 ring-inset ${
            isConnected
              ? 'bg-green-50 text-green-700 ring-green-500/20 dark:bg-green-500/10 dark:text-green-400'
              : 'bg-red-50 text-red-700 ring-red-500/20 dark:bg-red-500/10 dark:text-red-400'
          }`}
        >
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span
            className={`h-2 w-2 rounded-full ${
              isConnected ? 'animate-pulse bg-green-500' : 'bg-red-500'
            }`}
          />
          {isConnected ? 'Live Data' : 'Reconnecting...'}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Soil Moisture" value={readings.soilMoisture} icon={Gauge} tone="green" trend="+5%" unit="%" />
        <StatsCard title="Active Alerts" value={activeAlerts} icon={ShieldCheck} tone={activeAlerts > 0 ? 'red' : 'green'} unit="sensors" />
        <StatsCard title="System Uptime" value="99.8" icon={Activity} tone="blue" trend="+0.1%" unit="%" />
        <StatsCard title="Power Draw" value="4.2" icon={Zap} tone="orange" trend="-3%" unit="kWh" />
      </div>

      {/* Sensor Cards */}
      <div>
        <h2 className="mb-4 text-base font-semibold tracking-tight text-slate-900 dark:text-white">
          Sensor Fleet
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sensorDefinitions.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              value={readings[sensor.id]}
              history={history[sensor.id]}
            />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
            Soil Moisture Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={combinedTrend}>
              <defs>
                <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke="#16a34a"
                fill="url(#moistureGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
            Temperature &amp; Humidity (DHT22)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={combinedTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temp (°C)"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WeatherWidget />
        <CropStatus />
      </div>

      {/* Irrigation */}
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Irrigation System
          </h3>
          <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-500/20 dark:bg-green-500/10 dark:text-green-400">
            <Activity className="h-3.5 w-3.5" />
            Active
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Zone 1 - Wheat Field
              </span>
              <span className="font-bold text-slate-900 dark:text-white">65%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                style={{ width: '65%' }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Zone 2 - Rice Field
              </span>
              <span className="font-bold text-slate-900 dark:text-white">45%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                style={{ width: '45%' }}
              />
            </div>
          </div>

          <Button variant="primary" fullWidth>
            Manual Irrigation Control
          </Button>
        </div>
      </Card>
    </div>
  )
}