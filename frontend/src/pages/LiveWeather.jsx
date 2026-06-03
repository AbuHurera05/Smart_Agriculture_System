import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, Wind, Droplet, Thermometer, Calendar, MapPin } from 'lucide-react'
import Card from '../components/common/Card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function LiveWeather() {
  const [weather, setWeather] = useState({
    current: {
      temp: 28,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 12,
      pressure: 1012,
      uvIndex: 7,
    },
    forecast: [
      { day: 'Mon', temp: 27, condition: 'Sunny' },
      { day: 'Tue', temp: 26, condition: 'Cloudy' },
      { day: 'Wed', temp: 25, condition: 'Rainy' },
      { day: 'Thu', temp: 24, condition: 'Rainy' },
      { day: 'Fri', temp: 26, condition: 'Cloudy' },
      { day: 'Sat', temp: 28, condition: 'Sunny' },
      { day: 'Sun', temp: 29, condition: 'Sunny' },
    ],
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      temp: 20 + Math.sin(i / 24 * Math.PI * 2) * 10,
    })),
  })

  const getWeatherIcon = (condition) => {
    switch(condition.toLowerCase()) {
      case 'sunny': return <Sun className="w-16 h-16 text-yellow-500" />
      case 'cloudy': return <Cloud className="w-16 h-16 text-gray-500" />
      case 'rainy': return <CloudRain className="w-16 h-16 text-blue-500" />
      default: return <Sun className="w-16 h-16 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Weather</h1>
        <p className="text-gray-600 mt-1">Real-time weather updates for your farm</p>
      </div>
      
      {/* Current Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">Farm Location, India</span>
              </div>
              <div className="mt-4">
                <div className="text-6xl font-bold">{weather.current.temp}°C</div>
                <div className="text-xl mt-1">{weather.current.condition}</div>
              </div>
            </div>
            {getWeatherIcon(weather.current.condition)}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white border-opacity-20">
            <div className="text-center">
              <Wind className="w-5 h-5 mx-auto mb-2" />
              <p className="text-sm">{weather.current.windSpeed} km/h</p>
              <p className="text-xs opacity-80">Wind</p>
            </div>
            <div className="text-center">
              <Droplet className="w-5 h-5 mx-auto mb-2" />
              <p className="text-sm">{weather.current.humidity}%</p>
              <p className="text-xs opacity-80">Humidity</p>
            </div>
            <div className="text-center">
              <Thermometer className="w-5 h-5 mx-auto mb-2" />
              <p className="text-sm">UV {weather.current.uvIndex}</p>
              <p className="text-xs opacity-80">UV Index</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="font-semibold mb-4">Weather Highlights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pressure</span>
              <span className="font-medium">{weather.current.pressure} hPa</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Visibility</span>
              <span className="font-medium">10 km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sunrise</span>
              <span className="font-medium">6:30 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sunset</span>
              <span className="font-medium">6:15 PM</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Hourly Forecast */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">24-Hour Temperature Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weather.hourly}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#2e7d32" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      
      {/* 7-Day Forecast */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {weather.forecast.map((day, idx) => (
            <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{day.day}</p>
              <div className="my-2">
                {day.condition === 'Sunny' && <Sun className="w-8 h-8 mx-auto text-yellow-500" />}
                {day.condition === 'Cloudy' && <Cloud className="w-8 h-8 mx-auto text-gray-500" />}
                {day.condition === 'Rainy' && <CloudRain className="w-8 h-8 mx-auto text-blue-500" />}
              </div>
              <p className="text-lg font-bold">{day.temp}°C</p>
              <p className="text-xs text-gray-500">{day.condition}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}