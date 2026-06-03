import { useState } from 'react'
import { Sprout, TrendingUp, AlertTriangle } from 'lucide-react'
import Card from '../common/Card'

export default function CropStatus() {
  const [crops] = useState([
    { name: 'Rice', stage: 'Vegetative', health: 85, daysToHarvest: 45 },
    { name: 'Wheat', stage: 'Flowering', health: 92, daysToHarvest: 30 },
    { name: 'Maize', stage: 'Ripening', health: 78, daysToHarvest: 20 },
  ])

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Active Crops</h3>
      <div className="space-y-4">
        {crops.map((crop, idx) => (
          <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                <span className="font-medium">{crop.name}</span>
              </div>
              <span className={`badge ${
                crop.health > 80 ? 'badge-success' : 
                crop.health > 60 ? 'badge-warning' : 'badge-danger'
              }`}>
                {crop.health}% Health
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Stage</p>
                <p className="font-medium">{crop.stage}</p>
              </div>
              <div>
                <p className="text-gray-500">Days to Harvest</p>
                <p className="font-medium">{crop.daysToHarvest} days</p>
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-500"
                style={{ width: `${crop.health}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}