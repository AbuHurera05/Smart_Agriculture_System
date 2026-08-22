import { useState, useEffect } from 'react'
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplet,
  Thermometer,
  MapPin,
  RefreshCw,
} from 'lucide-react'

import Card from '../components/common/Card'
import { weatherAPI } from '../services/api'

export default function LiveWeather() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =========================================================
  // GET WEATHER ICON
  // =========================================================
  const getWeatherIcon = (condition, size = 'large') => {
    const value = condition?.toLowerCase() || ''

    const className =
      size === 'large'
        ? 'w-16 h-16'
        : 'w-8 h-8'

    if (
      value.includes('rain') ||
      value.includes('drizzle') ||
      value.includes('thunderstorm')
    ) {
      return (
        <CloudRain
          className={`${className} text-blue-500`}
        />
      )
    }

    if (
      value.includes('cloud') ||
      value.includes('overcast')
    ) {
      return (
        <Cloud
          className={`${className} text-gray-500`}
        />
      )
    }

    if (
      value.includes('clear') ||
      value.includes('sun')
    ) {
      return (
        <Sun
          className={`${className} text-yellow-500`}
        />
      )
    }

    return (
      <Sun
        className={`${className} text-yellow-500`}
      />
    )
  }

  // =========================================================
  // LOAD WEATHER
  // =========================================================
  const loadWeather = async () => {
    try {
      setLoading(true)
      setError('')

      // Get logged-in user
      const storedUser = localStorage.getItem('user')

      if (!storedUser) {
        setError('User information not found. Please login again.')
        return
      }

      const user = JSON.parse(storedUser)

      console.log('LOGGED IN USER:', user)

      const userLocation = user.location || ''

      const userCity = userLocation
        .split(',')[0]
        .trim()

      if (!userCity) {
        setError(
          'Your city is not available in your profile.'
        )
        return
      }

      setCity(userCity)

      console.log('USER CITY:', userCity)

      // =====================================================
      // CURRENT WEATHER
      // =====================================================

      const currentResponse =
        await weatherAPI.getCurrentWeather(userCity)

      console.log(
        'CURRENT WEATHER RESPONSE:',
        currentResponse.data
      )

    if (currentResponse.data?.success) {
        setWeather(currentResponse.data.data)
      } else {
        setError('Weather data could not be loaded.')
      }

      // =====================================================
      // 7-DAY FORECAST
      // =====================================================

      const forecastResponse =
        await weatherAPI.getForecast(userCity)

      console.log(
        'FORECAST RESPONSE:',
        forecastResponse.data
      )

      if (forecastResponse.data?.success) {
        setForecast(
          forecastResponse.data.data || []
        )
      } else {
        setForecast([])
      }

    } catch (err) {
      console.error('Weather error:', err)

      if (err.response) {
        setError(
          err.response.data?.message ||
          `Weather service error (${err.response.status})`
        )
      } else {
        setError(
          'Unable to connect to weather service.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // LOAD WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    loadWeather()
  }, [])

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">

          <RefreshCw
            className="w-10 h-10 animate-spin mx-auto text-primary"
          />

          <p className="mt-4 text-gray-600">
            Loading weather data...
          </p>

        </div>
      </div>
    )
  }

  // =========================================================
  // ERROR SCREEN
  // =========================================================

  if (error && !weather) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Live Weather
          </h1>

          <p className="text-gray-600 mt-1">
            Real-time weather updates for your farm
          </p>
        </div>

        <Card>
          <div className="text-center py-10">

            <Cloud className="w-16 h-16 mx-auto text-gray-400" />

            <h3 className="text-lg font-semibold mt-4">
              Unable to load weather
            </h3>

            <p className="text-gray-500 mt-2">
              {error}
            </p>

            <button
              onClick={loadWeather}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:opacity-90"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

          </div>
        </Card>

      </div>
    )
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Live Weather
          </h1>

          <p className="text-gray-600 mt-1">
            Real-time weather updates for your farm
          </p>
        </div>

        <button
          onClick={loadWeather}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              loading ? 'animate-spin' : ''
            }`}
          />

          Refresh
        </button>

      </div>

      {/* ===================================================
          ERROR MESSAGE
      =================================================== */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* ===================================================
          CURRENT WEATHER
      =================================================== */}

      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* -----------------------------------------------
              MAIN WEATHER CARD
          ------------------------------------------------ */}

          <Card className="lg:col-span-2 bg-gradient-to-r from-primary to-primary-dark text-white">

            <div className="flex items-center justify-between">

              <div>

                {/* LOCATION */}

                <div className="flex items-center gap-2">

                  <MapPin className="w-5 h-5" />

                  <span className="text-lg">
                    {city}
                  </span>

                </div>

                {/* TEMPERATURE */}

                <div className="mt-4">

                  <div className="text-6xl font-bold">
                    {weather.temp?.toFixed(1)}°C
                  </div>

                  <div className="text-xl mt-1">
                    {weather.condition}
                  </div>

                </div>

              </div>

              {/* WEATHER ICON */}

              <div>
                {getWeatherIcon(
                  weather.condition,
                  'large'
                )}
              </div>

            </div>

            {/* WEATHER DETAILS */}

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white border-opacity-20">

              {/* WIND */}

              <div className="text-center">

                <Wind className="w-5 h-5 mx-auto mb-2" />

                <p className="text-sm">
                  {weather.windSpeed?.toFixed(1)} km/h
                </p>

                <p className="text-xs opacity-80">
                  Wind
                </p>

              </div>

              {/* HUMIDITY */}

              <div className="text-center">

                <Droplet className="w-5 h-5 mx-auto mb-2" />

                <p className="text-sm">
                  {weather.humidity}%
                </p>

                <p className="text-xs opacity-80">
                  Humidity
                </p>

              </div>

              {/* UV */}

              <div className="text-center">

                <Thermometer className="w-5 h-5 mx-auto mb-2" />

                <p className="text-sm">
                  UV {weather.uvIndex}
                </p>

                <p className="text-xs opacity-80">
                  UV Index
                </p>

              </div>

            </div>

          </Card>

          {/* =================================================
              WEATHER HIGHLIGHTS
          ================================================= */}

          <Card>

            <h3 className="font-semibold mb-4">
              Weather Highlights
            </h3>

            <div className="space-y-4">

              {/* PRESSURE */}

              <div className="flex justify-between items-center">

                <span className="text-gray-600">
                  Pressure
                </span>

                <span className="font-medium">
                  {weather.pressure?.toFixed(0)} hPa
                </span>

              </div>

              {/* HUMIDITY */}

              <div className="flex justify-between items-center">

                <span className="text-gray-600">
                  Humidity
                </span>

                <span className="font-medium">
                  {weather.humidity}%
                </span>

              </div>

              {/* WIND */}

              <div className="flex justify-between items-center">

                <span className="text-gray-600">
                  Wind Speed
                </span>

                <span className="font-medium">
                  {weather.windSpeed?.toFixed(1)} km/h
                </span>

              </div>

              {/* UV */}

              <div className="flex justify-between items-center">

                <span className="text-gray-600">
                  UV Index
                </span>

                <span className="font-medium">
                  {weather.uvIndex}
                </span>

              </div>

            </div>

          </Card>

        </div>
      )}

      {/* ===================================================
          7-DAY FORECAST
      =================================================== */}

      <Card>

        <h3 className="text-lg font-semibold mb-4">
          7-Day Forecast
        </h3>

        {forecast.length === 0 ? (

          <div className="text-center py-8">

            <Cloud className="w-12 h-12 mx-auto text-gray-400" />

            <p className="text-gray-500 mt-3">
              Forecast data is not available.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">

            {forecast.map((day, index) => (

              <div
                key={index}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >

                {/* DAY */}

                <p className="font-medium">
                  {day.day}
                </p>

                {/* ICON */}

                <div className="my-3 flex justify-center">

                  {getWeatherIcon(
                    day.condition,
                    'small'
                  )}

                </div>

                {/* TEMPERATURE */}

                <p className="text-lg font-bold">
                  {day.temp?.toFixed(1)}°C
                </p>

                {/* CONDITION */}

                <p className="text-xs text-gray-500 mt-1">
                  {day.condition}
                </p>

              </div>

            ))}

          </div>

        )}

      </Card>

      {/* ===================================================
          LOCATION INFORMATION
      =================================================== */}

      <Card>

        <div className="flex items-center gap-3">

          <MapPin className="w-5 h-5 text-primary" />

          <div>

            <p className="text-sm text-gray-500">
              Weather Location
            </p>

            <p className="font-semibold">
              {city}
            </p>

          </div>

        </div>

      </Card>

    </div>
  )
}