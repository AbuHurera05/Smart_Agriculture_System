import { useEffect, useRef, useState, useCallback } from 'react'
import { sensorDefinitions } from '../utils/constants'
import { useWebSocket } from './useWebSocket'
import useStore from '../store/useStore'
import { iotAPI } from '../services/api'

const HISTORY_LENGTH = 24

const seedValue = (sensor) => {
  const mid = (sensor.thresholds.low + sensor.thresholds.high) / 2
  return Math.round(mid * 100) / 100
}

const jitter = (value, sensor) => {
  const range = (sensor.max - sensor.min) * 0.02
  let next = value + (Math.random() - 0.5) * range
  next = Math.max(sensor.min, Math.min(sensor.max, next))
  return Math.round(next * 100) / 100
}

const mapBackendToSensorId = (data, sensorId) => {
  if (!data) return undefined
  switch (sensorId) {
    case 'soilMoisture':
      return data.soilMoisture ?? data.moisture
    case 'temperature':
      return data.temperature
    case 'humidity':
      return data.humidity
    case 'rainfall':
      return data.rainValue ?? (data.isRaining ? 85 : 0)
    case 'waterLevel':
      return data.waterLevel
    case 'lightIntensity':
      return data.lightIntensity
    case 'pressure':
      return data.pressure
    default:
      return data[sensorId]
  }
}

/**
 * Connects to the backend IoT Service (/api/iot/telemetry) to fetch
 * live sensor readings and historical data curves.
 * Also synchronizes with WebSocket push events when connected.
 */
export function useSensorFeed() {
  const { sensorData, updateSensorData } = useStore()
  const { isConnected } = useWebSocket('sensorData', (data) => updateSensorData(data))

  const [readings, setReadings] = useState(() => {
    const init = {}
    sensorDefinitions.forEach((s) => { init[s.id] = seedValue(s) })
    return init
  })

  const [history, setHistory] = useState(() => {
    const init = {}
    sensorDefinitions.forEach((s) => { init[s.id] = [] })
    return init
  })

  const [backendConnected, setBackendConnected] = useState(false)
  const [motorStatus, setMotorStatus] = useState({ status: 'OFF', mode: 'AUTO' })

  // 1. Initial Load: Fetch latest telemetry and history from backend
  const fetchBackendData = useCallback(async () => {
    try {
      const [latestRes, historyRes, motorRes] = await Promise.allSettled([
        iotAPI.getLatestTelemetry(),
        iotAPI.getTelemetryHistory(24),
        iotAPI.getMotorStatus(),
      ])

      if (latestRes.status === 'fulfilled' && latestRes.value.data?.data) {
        const live = latestRes.value.data.data
        setBackendConnected(true)
        updateSensorData(live)

        setReadings((prev) => {
          const next = { ...prev }
          sensorDefinitions.forEach((s) => {
            const val = mapBackendToSensorId(live, s.id)
            if (val !== undefined && val !== null) {
              next[s.id] = val
            }
          })
          return next
        })
      }

      if (historyRes.status === 'fulfilled' && Array.isArray(historyRes.value.data?.data)) {
        const histList = historyRes.value.data.data
        if (histList.length > 0) {
          const nextHist = {}
          sensorDefinitions.forEach((s) => {
            nextHist[s.id] = histList.map((pt) => {
              const val = mapBackendToSensorId(pt, s.id)
              const timeStr = pt.timestamp
                ? new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              return { time: timeStr, value: val !== undefined ? val : seedValue(s) }
            })
          })
          setHistory(nextHist)
        }
      }

      if (motorRes.status === 'fulfilled' && motorRes.value.data?.data) {
        setMotorStatus(motorRes.value.data.data)
      }
    } catch (err) {
      console.warn('Backend IoT telemetry fetch notice:', err.message)
    }
  }, [updateSensorData])

  useEffect(() => {
    fetchBackendData()
  }, [fetchBackendData])

  // 2. Periodic sync with backend every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      iotAPI.getLatestTelemetry()
        .then((res) => {
          if (res.data?.data) {
            setBackendConnected(true)
            const live = res.data.data
            updateSensorData(live)
            setReadings((prev) => {
              const next = { ...prev }
              sensorDefinitions.forEach((s) => {
                const val = mapBackendToSensorId(live, s.id)
                next[s.id] = val !== undefined && val !== null ? val : jitter(prev[s.id], s)
              })
              return next
            })
          }
        })
        .catch(() => {
          // Fallback simulation when backend server is restarting or offline
          setReadings((prev) => {
            const next = { ...prev }
            sensorDefinitions.forEach((s) => {
              const val = mapBackendToSensorId(sensorData, s.id)
              next[s.id] = val !== undefined && val !== null ? val : jitter(prev[s.id], s)
            })
            return next
          })
        })
    }, 4000)

    return () => clearInterval(interval)
  }, [sensorData, updateSensorData])

  // 3. Roll history array on readings change
  useEffect(() => {
    setHistory((prev) => {
      const next = {}
      sensorDefinitions.forEach((sensor) => {
        const arr = [...(prev[sensor.id] || []), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: readings[sensor.id],
        }]
        next[sensor.id] = arr.slice(-HISTORY_LENGTH)
      })
      return next
    })
  }, [readings])

  return {
    readings,
    history,
    isConnected: isConnected || backendConnected,
    motorStatus,
    refreshData: fetchBackendData,
  }
}
