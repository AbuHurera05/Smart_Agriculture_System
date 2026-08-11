import { useEffect, useRef, useState } from 'react'
import { sensorDefinitions } from '../utils/constants'
import { useWebSocket } from './useWebSocket'
import useStore from '../store/useStore'

const HISTORY_LENGTH = 24

const seedValue = (sensor) => {
  const mid = (sensor.thresholds.low + sensor.thresholds.high) / 2
  return Math.round(mid * 100) / 100
}

const jitter = (value, sensor) => {
  const range = (sensor.max - sensor.min) * 0.03
  let next = value + (Math.random() - 0.5) * range
  next = Math.max(sensor.min, Math.min(sensor.max, next))
  return Math.round(next * 100) / 100
}

const legacyFieldMap = {
  soilMoisture: 'moisture',
}

/**
 * Provides current readings + rolling history for all six sensors.
 * Prefers real values pushed over the WebSocket (via the shared store's
 * sensorData); falls back to a gentle live simulation for any field the
 * backend hasn't sent yet, so the dashboard stays fully functional in
 * demo/dev environments without a live IoT gateway attached.
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

  const readingsRef = useRef(readings)
  readingsRef.current = readings

  useEffect(() => {
    const interval = setInterval(() => {
      setReadings((prev) => {
        const next = { ...prev }
        sensorDefinitions.forEach((sensor) => {
          const backendValue = sensorData?.[sensor.id] ?? sensorData?.[legacyFieldMap[sensor.id]]
          next[sensor.id] = (backendValue !== undefined && backendValue !== null)
            ? backendValue
            : jitter(prev[sensor.id], sensor)
        })
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [sensorData])

  useEffect(() => {
    setHistory((prev) => {
      const next = {}
      sensorDefinitions.forEach((sensor) => {
        const arr = [...(prev[sensor.id] || []), { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: readings[sensor.id] }]
        next[sensor.id] = arr.slice(-HISTORY_LENGTH)
      })
      return next
    })
  }, [readings])

  return { readings, history, isConnected }
}
