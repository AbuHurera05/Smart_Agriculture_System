import { useState } from 'react'
import { 
  Droplet, Clock, Calendar, Thermometer, Wind, TrendingUp,
  Play, Pause, Settings, AlertTriangle, CheckCircle, Zap
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function IrrigationAdvice() {
  const [autoMode, setAutoMode] = useState(true)
  const [selectedZone, setSelectedZone] = useState('all')

  const zones = [
    { id: 1, name: 'Zone 1 - North Field', crop: 'Rice', moisture: 45, optimal: 60, status: 'needs_water', schedule: '2 hours' },
    { id: 2, name: 'Zone 2 - South Field', crop: 'Wheat', moisture: 68, optimal: 60, status: 'optimal', schedule: '0 hours' },
    { id: 3, name: 'Zone 3 - East Field', crop: 'Maize', moisture: 32, optimal: 55, status: 'critical', schedule: '3 hours' },
    { id: 4, name: 'Zone 4 - West Field', crop: 'Cotton', moisture: 55, optimal: 50, status: 'optimal', schedule: '0 hours' },
  ]

  const schedule = [
    { time: '06:00 AM', zones: ['Zone 1', 'Zone 3'], duration: '1.5 hours', status: 'completed' },
    { time: '12:00 PM', zones: ['Zone 2'], duration: '1 hour', status: 'upcoming' },
    { time: '06:00 PM', zones: ['Zone 1', 'Zone 4'], duration: '2 hours', status: 'upcoming' },
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'text-danger bg-danger bg-opacity-10'
      case 'needs_water': return 'text-warning bg-warning bg-opacity-10'
      case 'optimal': return 'text-success bg-success bg-opacity-10'
      default: return 'text-gray-500 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'critical': return 'Critical - Water Now!'
      case 'needs_water': return 'Needs Water'
      case 'optimal': return 'Optimal'
      default: return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Irrigation Advice</h1>
          <p className="text-gray-600 mt-1">Smart irrigation scheduling and water management</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={autoMode ? 'primary' : 'secondary'}
            onClick={() => setAutoMode(!autoMode)}
          >
            {autoMode ? <Zap className="w-4 h-4 mr-2" /> : <Settings className="w-4 h-4 mr-2" />}
            {autoMode ? 'Auto Mode ON' : 'Manual Mode'}
          </Button>
        </div>
      </div>

      {/* Water Savings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Water Saved</p>
              <p className="text-2xl font-bold">1,250 L</p>
              <p className="text-xs text-success mt-1">+23% this month</p>
            </div>
            <Droplet className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Next Irrigation</p>
              <p className="text-2xl font-bold">2:30 PM</p>
              <p className="text-xs text-gray-500 mt-1">Today</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500 opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Duration</p>
              <p className="text-2xl font-bold">4.5 hrs</p>
              <p className="text-xs text-gray-500 mt-1">Today's schedule</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Efficiency</p>
              <p className="text-2xl font-bold">92%</p>
              <p className="text-xs text-success mt-1">+5% improvement</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Weather Conditions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Weather Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <Thermometer className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Temperature</p>
              <p className="font-semibold">28°C</p>
              <p className="text-xs text-gray-400">High evaporation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wind className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Wind Speed</p>
              <p className="font-semibold">12 km/h</p>
              <p className="text-xs text-gray-400">Moderate</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Droplet className="w-8 h-8 text-cyan-500" />
            <div>
              <p className="text-sm text-gray-500">Rain Forecast</p>
              <p className="font-semibold">20% chance</p>
              <p className="text-xs text-gray-400">Next 24h</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Best Time</p>
              <p className="font-semibold">Early Morning</p>
              <p className="text-xs text-gray-400">6:00 AM - 8:00 AM</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Zone Status */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Field Zones Status</h3>
          <select 
            className="input-field w-40"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
          >
            <option value="all">All Zones</option>
            <option value="needs_water">Needs Water</option>
            <option value="critical">Critical</option>
            <option value="optimal">Optimal</option>
          </select>
        </div>
        
        <div className="space-y-4">
          {zones
            .filter(zone => selectedZone === 'all' || zone.status === selectedZone)
            .map(zone => (
              <div key={zone.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{zone.name}</h4>
                      <span className={`badge ${getStatusColor(zone.status)}`}>
                        {getStatusText(zone.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Crop: {zone.crop}</p>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Soil Moisture</span>
                        <span className={zone.moisture < zone.optimal ? 'text-warning' : 'text-success'}>
                          {zone.moisture}% (Target: {zone.optimal}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`rounded-full h-2 transition-all ${
                            zone.moisture < zone.optimal ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${(zone.moisture / zone.optimal) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {zone.status !== 'optimal' && (
                      <Button 
                        variant={zone.status === 'critical' ? 'danger' : 'primary'} 
                        size="sm"
                      >
                        {autoMode ? 'Auto Schedule' : 'Irrigate Now'}
                      </Button>
                    )}
                    {zone.status === 'optimal' && (
                      <div className="flex items-center gap-1 text-success">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Optimal</span>
                      </div>
                    )}
                    {zone.schedule !== '0 hours' && (
                      <p className="text-xs text-gray-500 mt-2">Scheduled: {zone.schedule}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Today's Irrigation Schedule</h3>
        <div className="space-y-3">
          {schedule.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-semibold">{item.time}</p>
                </div>
                <div>
                  <p className="font-medium">{item.zones.join(', ')}</p>
                  <p className="text-sm text-gray-500">Duration: {item.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.status === 'completed' ? (
                  <span className="badge badge-success">Completed</span>
                ) : (
                  <>
                    <Button variant="secondary" size="sm">
                      {autoMode ? 'Auto' : <Play className="w-3 h-3" />}
                    </Button>
                    {!autoMode && (
                      <Button variant="secondary" size="sm">
                        <Pause className="w-3 h-3" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">AI Recommendation</p>
              <p className="text-sm text-blue-800">
                Based on weather forecast, reduce irrigation by 15% this week. Rain expected on Thursday.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}