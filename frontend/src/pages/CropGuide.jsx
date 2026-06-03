import { useState } from 'react'
import { Search, Filter, Sprout, Calendar, Droplet, Thermometer } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function CropGuide() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCrop, setSelectedCrop] = useState(null)

  const crops = [
    {
      id: 1,
      name: 'Rice',
      season: 'Kharid (June-Oct)',
      waterRequirement: 'High',
      tempRange: '20-35°C',
      soilType: 'Clay loam',
      duration: '120-150 days',
      image: '🌾',
    },
    {
      id: 2,
      name: 'Wheat',
      season: 'Rabi (Nov-Apr)',
      waterRequirement: 'Medium',
      tempRange: '15-25°C',
      soilType: 'Loamy',
      duration: '100-120 days',
      image: '🌾',
    },
    {
      id: 3,
      name: 'Maize',
      season: 'Kharid (June-Oct)',
      waterRequirement: 'Medium',
      tempRange: '21-27°C',
      soilType: 'Well-drained loam',
      duration: '90-110 days',
      image: '🌽',
    },
    {
      id: 4,
      name: 'Cotton',
      season: 'Kharid (May-June)',
      waterRequirement: 'Low-Medium',
      tempRange: '20-30°C',
      soilType: 'Black soil',
      duration: '150-180 days',
      image: '🌿',
    },
  ]

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Crop Guide</h1>
        <p className="text-gray-600 mt-1">Comprehensive information about different crops</p>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <Card
            key={crop.id}
            hover
            onClick={() => setSelectedCrop(selectedCrop?.id === crop.id ? null : crop)}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{crop.image}</div>
              <h3 className="text-xl font-bold text-gray-900">{crop.name}</h3>
              <p className="text-sm text-gray-500">{crop.season}</p>
            </div>
            
            {selectedCrop?.id === crop.id && (
              <div className="mt-4 pt-4 border-t space-y-3 animate-fadeIn">
                <div className="flex items-center gap-3 text-sm">
                  <Droplet className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Water: {crop.waterRequirement}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  <span className="text-gray-600">Temperature: {crop.tempRange}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Sprout className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Soil: {crop.soilType}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">Duration: {crop.duration}</span>
                </div>
                <Button variant="primary" size="sm" className="w-full mt-2">
                  Get Detailed Guide
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}