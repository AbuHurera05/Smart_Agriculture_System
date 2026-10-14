import { useEffect, useState, useCallback } from 'react'
import {
  Activity,
  Wifi,
  WifiOff,
  Gauge,
  ShieldCheck,
  Zap,
  Cpu,
  MapPin,
  Sprout,
  Plus,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import toast from 'react-hot-toast'
import StatsCard from '../components/dashboard/StatsCard'
import SensorCard from '../components/dashboard/SensorCard'
import WeatherWidget from '../components/dashboard/WeatherWidget'
import CropStatus from '../components/dashboard/CropStatus'
import RequestSetupModal from '../components/dashboard/RequestSetupModal'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { SkeletonCard, SkeletonChart } from '../components/common/Skeleton'
import { useSensorFeed } from '../hooks/useSensorFeed'
import { sensorDefinitions } from '../utils/constants'
import { iotAPI } from '../services/api'
import { useAuthContext } from '../context/AuthContext'

export default function IoTDashboard() {
  const { user } = useAuthContext()
  const { readings, history, isConnected, motorStatus: initialMotor, refreshData } = useSensorFeed()
  const [loading, setLoading] = useState(true)
  const [motorStatus, setMotorStatus] = useState(initialMotor)
  const [motorLoading, setMotorLoading] = useState(false)

  // Hardware Setups & Multi-tenancy
  const [mySetups, setMySetups] = useState([])
  const [activeSetupIndex, setActiveSetupIndex] = useState(0)
  const [myRequests, setMyRequests] = useState([])
  const [setupsLoading, setSetupsLoading] = useState(true)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  const loadUserSetups = useCallback(async () => {
    try {
      setSetupsLoading(true)
      const [setupsRes, reqsRes] = await Promise.allSettled([
        iotAPI.getMySetups(),
        iotAPI.getMySetupRequests(),
      ])

      if (setupsRes.status === 'fulfilled' && Array.isArray(setupsRes.value.data?.data)) {
        setMySetups(setupsRes.value.data.data)
      }
      if (reqsRes.status === 'fulfilled' && Array.isArray(reqsRes.value.data?.data)) {
        setMyRequests(reqsRes.value.data.data)
      }
    } catch (err) {
      console.warn('Could not load user setups:', err)
    } finally {
      setSetupsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUserSetups()
  }, [loadUserSetups])

  useEffect(() => {
    if (initialMotor) setMotorStatus(initialMotor)
  }, [initialMotor])

  const handleMotorToggle = async (action) => {
    setMotorLoading(true)
    try {
      const res = await iotAPI.controlMotor({
        action,
        mode: motorStatus?.mode || 'MANUAL',
        reason: 'User toggled via Farm Dashboard',
      })
      if (res.data?.data) {
        setMotorStatus(res.data.data)
        toast.success(`Pump motor turned ${res.data.data.status}`)
        refreshData?.()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to toggle motor')
    } finally {
      setMotorLoading(false)
    }
  }

  const handleModeSwitch = async () => {
    const nextMode = motorStatus?.mode === 'AUTO' ? 'MANUAL' : 'AUTO'
    setMotorLoading(true)
    try {
      const res = await iotAPI.controlMotor({
        action: motorStatus?.status === 'ON' ? 'START' : 'STOP',
        mode: nextMode,
        reason: `User switched mode to ${nextMode}`,
      })
      if (res.data?.data) {
        setMotorStatus(res.data.data)
        toast.success(`Irrigation mode switched to ${nextMode}`)
        refreshData?.()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to switch mode')
    } finally {
      setMotorLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
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

  const selectedKit = mySetups[activeSetupIndex] || mySetups[0]
  const pendingRequest = myRequests.find((r) => r.status === 'PENDING')
  const hasHardware = mySetups.length > 0

  if (loading || setupsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      {/* =========================================================
          TOP FARM / HARDWARE KIT HEADER
      ========================================================= */}
      {hasHardware ? (
        <div className="p-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 to-teal-50/40 dark:border-emerald-500/20 dark:from-emerald-500/10 dark:to-transparent">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 shrink-0">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950">
                    {selectedKit.setupCode}
                  </span>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {selectedKit.farmName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online Kit
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {selectedKit.location || 'Farm Location'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Sprout className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    Crop: <strong>{selectedKit.cropType || 'Crop'}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    Power: {selectedKit.battery || 'AC Main'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Field Switcher (if multiple) & Add Kit button */}
            <div className="flex flex-wrap items-center gap-2">
              {mySetups.length > 1 && (
                <div className="flex items-center gap-1 bg-white dark:bg-night-card p-1 rounded-xl border border-slate-200 dark:border-white/10">
                  {mySetups.map((kit, idx) => (
                    <button
                      key={kit.id}
                      onClick={() => setActiveSetupIndex(idx)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        activeSetupIndex === idx
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                      }`}
                    >
                      {kit.cropType || `Field ${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowApplyModal(true)}
                leftIcon={<Plus className="h-4 w-4" />}
                className="!text-xs"
              >
                Request Another Setup
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* NO HARDWARE LINKED BANNER */
        <div className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-night-raised shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 shrink-0">
                <Cpu className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Connect Your Farm with AsanKisan Smart IoT Sensors
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                  You do not have an active hardware sensor kit linked to your account yet.
                  Request a setup for your field to monitor soil moisture, air temperature, raindrop alerts, and automate your tube well motor.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowApplyModal(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Apply for IoT Kit
              </Button>
              {!demoMode ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDemoMode(true)
                    toast('Simulated preview active. Exploring sample telemetry.', { icon: '🔬' })
                  }}
                  leftIcon={<Eye className="h-4 w-4" />}
                >
                  Preview Demo Data
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDemoMode(false)}
                >
                  Exit Demo
                </Button>
              )}
            </div>
          </div>

          {/* Pending application state if farmer already applied */}
          {pendingRequest && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/10 flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Application Under Review by Admin ({pendingRequest.farmName})
                  </p>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                    Applied for {pendingRequest.cropType} in {pendingRequest.farmLocation || 'your region'}. Hardware kit will be dispatched and activated shortly.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-200/80 text-amber-900 dark:bg-amber-400/20 dark:text-amber-300">
                PENDING
              </span>
            </div>
          )}
        </div>
      )}

      {/* Demo notice if demo active */}
      {demoMode && !hasHardware && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 text-xs text-blue-800 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>
              <strong>Simulation Mode:</strong> Showing live simulated sensor streams for demonstration purposes.
            </span>
          </div>
          <button
            onClick={() => setShowApplyModal(true)}
            className="font-bold underline hover:text-blue-900"
          >
            Apply for Real Hardware Kit &rarr;
          </button>
        </div>
      )}

      {/* Main Dashboard Monitoring (only rendered if user has hardware OR demo mode enabled) */}
      {(hasHardware || demoMode) && (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Soil Moisture"
              value={readings.soilMoisture}
              icon={Gauge}
              tone="green"
              trend="+5%"
              unit="%"
            />
            <StatsCard
              title="Active Alerts"
              value={activeAlerts}
              icon={ShieldCheck}
              tone={activeAlerts > 0 ? 'red' : 'green'}
              unit="sensors"
            />
            <StatsCard
              title="System Uptime"
              value="99.8"
              icon={Activity}
              tone="blue"
              trend="+0.1%"
              unit="%"
            />
            <StatsCard
              title="Power Draw"
              value="4.2"
              icon={Zap}
              tone="orange"
              trend="-3%"
              unit="kWh"
            />
          </div>

          {/* 6 Sensor Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Sensor Fleet (5 Probes + Motor)</h2>
              <span className="text-xs text-slate-500">
                ESP32 • Soil Moisture • DHT22 • Raindrop • Water Level
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Soil Moisture Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={combinedTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    stroke="#2e7d32"
                    fill="#4caf50"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Temperature &amp; Humidity (DHT22)</h3>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherWidget />
            <CropStatus />
          </div>

          {/* Irrigation Pump & Automation Status */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Smart Irrigation &amp; Pump Control</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ESP32 Relay Controller • Dry-run Protection • Rain Pause
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    motorStatus?.status === 'ON'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      motorStatus?.status === 'ON' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  Motor: {motorStatus?.status === 'ON' ? 'RUNNING' : 'STOPPED'}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                  Mode: {motorStatus?.mode || 'AUTO'}
                </span>
              </div>
            </div>

            {/* Live Safety Checks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <span className="text-xs text-slate-500 dark:text-slate-400">Tank Water Level</span>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-base font-bold ${
                      (readings.waterLevel ?? 80) <= 15
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {readings.waterLevel ?? 80}%
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {(readings.waterLevel ?? 80) <= 15 ? '⚠️ Empty (Locked)' : 'Safe Depth'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${
                      (readings.waterLevel ?? 80) <= 15 ? 'bg-red-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, readings.waterLevel ?? 80)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <span className="text-xs text-slate-500 dark:text-slate-400">Soil Moisture</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {readings.soilMoisture ?? 48}%
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {(readings.soilMoisture ?? 48) < 30 ? 'Dry (<30%)' : 'Optimal'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, readings.soilMoisture ?? 48)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <span className="text-xs text-slate-500 dark:text-slate-400">Raindrop Sensor</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {(readings.rainfall ?? 0) > 30 ? 'Rain Detected' : 'No Rain'}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {readings.rainfall ?? 0}% Intensity
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, readings.rainfall ?? 0)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleMotorToggle(motorStatus?.status === 'ON' ? 'STOP' : 'START')}
                disabled={
                  motorLoading ||
                  ((readings.waterLevel ?? 80) <= 15 && motorStatus?.status !== 'ON')
                }
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                  motorStatus?.status === 'ON'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {motorLoading
                  ? 'Applying Command...'
                  : motorStatus?.status === 'ON'
                  ? 'Turn Water Pump OFF'
                  : 'Turn Water Pump ON'}
              </button>

              <button
                onClick={handleModeSwitch}
                disabled={motorLoading}
                className="py-2.5 px-4 rounded-xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-night-card dark:text-white dark:hover:bg-white/5"
              >
                Switch to {motorStatus?.mode === 'AUTO' ? 'MANUAL' : 'AUTO'} Mode
              </button>
            </div>
          </Card>
        </>
      )}

      {/* =========================================================
          APPLY FOR IOT SETUP MODAL
      ========================================================= */}
      <RequestSetupModal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={() => loadUserSetups()}
      />
    </div>
  )
}
