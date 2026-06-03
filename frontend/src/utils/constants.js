export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'

export const cropTypes = [
  { id: 1, name: 'Rice', season: 'Kharif', duration: '120-150 days' },
  { id: 2, name: 'Wheat', season: 'Rabi', duration: '100-120 days' },
  { id: 3, name: 'Maize', season: 'Kharif', duration: '90-110 days' },
  { id: 4, name: 'Cotton', season: 'Kharif', duration: '150-180 days' },
  { id: 5, name: 'Sugarcane', season: 'Annual', duration: '300-365 days' },
]

export const soilTypes = [
  { id: 1, name: 'Clay Soil', phRange: '5.5-7.0' },
  { id: 2, name: 'Sandy Soil', phRange: '6.0-7.5' },
  { id: 3, name: 'Loamy Soil', phRange: '6.0-7.0' },
  { id: 4, name: 'Peaty Soil', phRange: '4.0-5.5' },
]

export const weatherConditions = [
  'Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Windy', 'Foggy'
]

export const sensorThresholds = {
  moisture: { min: 30, max: 80, optimal: 60 },
  temperature: { min: 15, max: 35, optimal: 25 },
  humidity: { min: 40, max: 80, optimal: 60 },
  ph: { min: 5.5, max: 7.5, optimal: 6.5 },
}