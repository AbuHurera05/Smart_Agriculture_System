import { io } from 'socket.io-client'
import { WS_URL } from '../utils/constants'
import useStore from '../store/useStore'

class WebSocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect() {
    if (this.socket?.connected) return

    try {
      this.socket = io(WS_URL, {
        transports: ['websocket'],
        autoConnect: false,
        reconnection: false, // Prevent continuous reconnect console spam
        timeout: 2000,
      })

      this.socket.on('connect', () => {
        this.trigger('connected', true)
      })

      this.socket.on('disconnect', () => {
        this.trigger('disconnected', false)
      })

      this.socket.on('connect_error', () => {
        // Silently mark disconnected without dumping red network errors
        this.trigger('disconnected', false)
      })

      this.socket.on('sensor-data', (data) => {
        useStore.getState().updateSensorData(data)
        this.trigger('sensorData', data)
      })

      this.socket.on('alert', (alert) => {
        useStore.getState().addNotification(alert)
        this.trigger('alert', alert)
      })

      this.socket.on('irrigation-status', (status) => {
        this.trigger('irrigationStatus', status)
      })

      // Attempt single silent connection
      this.socket.connect()
    } catch {
      this.trigger('disconnected', false)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index !== -1) callbacks.splice(index, 1)
    }
  }

  trigger(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data))
    }
  }

  send(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    }
  }

  subscribeToSensor(sensorId) {
    this.send('subscribe', { sensorId })
  }

  unsubscribeFromSensor(sensorId) {
    this.send('unsubscribe', { sensorId })
  }
}

export default new WebSocketService()