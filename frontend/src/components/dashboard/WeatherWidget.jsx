import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, Wind, Droplet, Thermometer } from 'lucide-react'
import Card from '../common/Card'

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 28,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    rainfall: 0,
  })

  const getWeatherIcon = () => {
    switch(weather.condition.toLowerCase()) {
      case 'sunny': return <Sun className="w-12 h-12 text-yellow-500" />
      case 'cloudy': return <Cloud className="w-12 h-12 text-gray-500" />
      case 'rainy': return <CloudRain className="w-12 h-12 text-blue-500" />
      default: return <Sun className="w-12 h-12 text-yellow-500" />
    }
  }

  return (
    <Card className="bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Current Weather</h3>
          <p className="text-sm opacity-90">Farm Location</p>
        </div>
        {getWeatherIcon()}
      </div>
      
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{weather.temp}°C</span>
          <span className="text-lg">{weather.condition}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white border-opacity-20">
        <div className="text-center">
          <Droplet className="w-5 h-5 mx-auto mb-1" />
          <p className="text-sm">{weather.humidity}%</p>
          <p className="text-xs opacity-80">Humidity</p>
        </div>
        <div className="text-center">
          <Wind className="w-5 h-5 mx-auto mb-1" />
          <p className="text-sm">{weather.windSpeed} km/h</p>
          <p className="text-xs opacity-80">Wind</p>
        </div>
        <div className="text-center">
          <CloudRain className="w-5 h-5 mx-auto mb-1" />
          <p className="text-sm">{weather.rainfall} mm</p>
          <p className="text-xs opacity-80">Rainfall</p>
        </div>
      </div>
    </Card>
  )
}