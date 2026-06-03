import { useState, useEffect } from 'react'
import { Droplet, Thermometer, Wind, Sun, Activity, WifiOff } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatsCard from '../components/dashboard/StatsCard'
import WeatherWidget from '../components/dashboard/WeatherWidget'
import CropStatus from '../components/dashboard/CropStatus'
import Card from '../components/common/Card'
import Loader from '../components/common/Loader'
import { useWebSocket } from '../hooks/useWebSocket'
import useStore from '../store/useStore'

export default function IoTDashboard() {
  const { sensorData, updateSensorData } = useStore()
  const [historicalData, setHistoricalData] = useState([])
  const [loading, setLoading] = useState(true)

  const { isConnected } = useWebSocket('sensorData', (data) => {
    updateSensorData(data)
  })

  useEffect(() => {
    // Simulate loading historical data
    setTimeout(() => {
      const mockData = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        moisture: 40 + Math.random() * 40,
        temperature: 20 + Math.random() * 15,
        humidity: 50 + Math.random() * 30,
      }))
      setHistoricalData(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">IoT Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time sensor monitoring and analytics</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isConnected ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-danger'}`} />
          <span className="text-sm font-medium">
            {isConnected ? 'Live Data' : 'Connecting...'}
          </span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Soil Moisture"
          value={sensorData.moisture || 65}
          icon={Droplet}
          color="text-blue-600"
          trend="+5%"
          unit="%"
        />
        <StatsCard 
          title="Temperature"
          value={sensorData.temperature || 28}
          icon={Thermometer}
          color="text-red-600"
          trend="-2%"
          unit="°C"
        />
        <StatsCard 
          title="Humidity"
          value={sensorData.humidity || 72}
          icon={Wind}
          color="text-green-600"
          trend="+3%"
          unit="%"
        />
        <StatsCard 
          title="Light Intensity"
          value={((sensorData.light || 45000) / 1000).toFixed(1)}
          icon={Sun}
          color="text-yellow-600"
          trend="+12%"
          unit="k lux"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Soil Moisture Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="moisture" stroke="#2e7d32" fill="#4caf50" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold mb-4">Temperature & Humidity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#f44336" strokeWidth={2} />
              <Line type="monotone" dataKey="humidity" stroke="#2196f3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherWidget />
        <CropStatus />
      </div>
      
      {/* Irrigation Status */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Irrigation System</h3>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-success" />
            <span className="text-sm text-success font-medium">Active</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Zone 1 - Wheat Field</span>
              <span className="text-sm font-medium">65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary rounded-full h-2 transition-all duration-500" style={{ width: '65%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Zone 2 - Rice Field</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-warning rounded-full h-2 transition-all duration-500" style={{ width: '45%' }} />
            </div>
          </div>
          <button className="btn-primary w-full mt-4">
            Manual Irrigation Control
          </button>
        </div>
      </Card>
    </div>
  )
}