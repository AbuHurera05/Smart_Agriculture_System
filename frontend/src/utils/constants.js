export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8081/ws'

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

// ---------------- IoT Sensor Fleet ----------------
// Central definition for the six physical sensors monitored across
// the Dashboard, Live Monitoring and Sensor Details pages.
export const sensorDefinitions = [
  {
    id: 'soilMoisture',
    name: 'Soil Moisture',
    module: 'Capacitive Soil Moisture Sensor',
    unit: '%',
    icon: 'Droplets',
    color: '#2e7d32',
    min: 0,
    max: 100,
    thresholds: { low: 30, high: 80 },
    description: 'Measures volumetric water content in the root zone.',
  },
  {
    id: 'temperature',
    name: 'Air Temperature',
    module: 'DHT22 Sensor',
    unit: '°C',
    icon: 'Thermometer',
    color: '#f97316',
    min: -10,
    max: 50,
    thresholds: { low: 15, high: 35 },
    description: 'Ambient temperature reading from the DHT22 module.',
  },
  {
    id: 'humidity',
    name: 'Air Humidity',
    module: 'DHT22 Sensor',
    unit: '%',
    icon: 'CloudDrizzle',
    color: '#0ea5e9',
    min: 0,
    max: 100,
    thresholds: { low: 40, high: 85 },
    description: 'Relative humidity reading from the DHT22 module.',
  },
  {
    id: 'lightIntensity',
    name: 'Light Intensity',
    module: 'LDR Sensor Module',
    unit: 'lux',
    icon: 'Sun',
    color: '#eab308',
    min: 0,
    max: 100000,
    thresholds: { low: 5000, high: 80000 },
    description: 'Ambient light level detected by the photoresistor module.',
  },
  {
    id: 'rainfall',
    name: 'Rain Detection',
    module: 'Rain Sensor',
    unit: '%',
    icon: 'CloudRain',
    color: '#3b82f6',
    min: 0,
    max: 100,
    thresholds: { low: 0, high: 60 },
    description: 'Rain intensity detected on the sensor board surface.',
  },
  {
    id: 'waterLevel',
    name: 'Water Level',
    module: 'Water Level Sensor',
    unit: '%',
    icon: 'Waves',
    color: '#06b6d4',
    min: 0,
    max: 100,
    thresholds: { low: 20, high: 95 },
    description: 'Reservoir / tank water level for the irrigation system.',
  },
  {
    id: 'pressure',
    name: 'Atmospheric Pressure',
    module: 'BMP280 Sensor',
    unit: 'hPa',
    icon: 'Gauge',
    color: '#8b5cf6',
    min: 950,
    max: 1050,
    thresholds: { low: 990, high: 1030 },
    description: 'Barometric pressure reading from the BMP280 module.',
  },
]
// ---------------- Marketplace ----------------
export const productCategories = [
  { id: 'produce', name: 'Fresh Produce', icon: '🌾' },
  { id: 'seeds', name: 'Seeds & Saplings', icon: '🌱' },
  { id: 'fertilizers', name: 'Fertilizers & Pesticides', icon: '🧪' },
  { id: 'equipment', name: 'Equipment & Machinery', icon: '🚜' },
  { id: 'tools', name: 'Tools', icon: '🛠️' },
  { id: 'livestock', name: 'Livestock & Dairy', icon: '🐄' },
]

export const productUnits = ['kg', 'quintal', 'ton', 'liter', 'piece', 'acre', 'dozen']

export const orderStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

export const orderStatusColor = {
  Pending: 'badge-warning',
  Confirmed: 'badge-info',
  Packed: 'badge-info',
  Shipped: 'badge-info',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
}
