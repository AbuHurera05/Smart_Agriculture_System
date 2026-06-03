import { useState } from 'react'
import { 
  Map, Plus, Edit2, Trash2, Maximize2, Minimize2, 
  Download, Upload, Layers, Ruler, Crop, Droplet,
  TrendingUp, AlertCircle, CheckCircle, Clock
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function LandManagement() {
  const [view, setView] = useState('map')
  const [selectedField, setSelectedField] = useState(null)
  const [showFieldModal, setShowFieldModal] = useState(false)

  const [fields, setFields] = useState([
    {
      id: 1,
      name: 'North Field',
      size: 5.2,
      unit: 'acres',
      crop: 'Rice',
      soilType: 'Clay Loam',
      soilHealth: 85,
      moisture: 65,
      status: 'active',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      boundaries: [[28.6139, 77.2090], [28.6145, 77.2095], [28.6140, 77.2100]],
      history: [
        { season: 'Kharif 2023', crop: 'Rice', yield: '2.8 tons/acre' },
        { season: 'Rabi 2023', crop: 'Wheat', yield: '3.2 tons/acre' }
      ]
    },
    {
      id: 2,
      name: 'South Field',
      size: 3.8,
      unit: 'acres',
      crop: 'Wheat',
      soilType: 'Sandy Loam',
      soilHealth: 72,
      moisture: 45,
      status: 'active',
      coordinates: { lat: 28.6120, lng: 77.2080 }
    },
    {
      id: 3,
      name: 'East Field',
      size: 4.5,
      unit: 'acres',
      crop: 'Maize',
      soilType: 'Alluvial',
      soilHealth: 91,
      moisture: 78,
      status: 'fallow',
      coordinates: { lat: 28.6148, lng: 77.2105 }
    }
  ])

  const totalArea = fields.reduce((sum, field) => sum + field.size, 0)

  const handleAddField = () => {
    setSelectedField(null)
    setShowFieldModal(true)
  }

  const handleEditField = (field) => {
    setSelectedField(field)
    setShowFieldModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Land Management</h1>
          <p className="text-gray-600 mt-1">Manage your farm lands, track soil health, and optimize usage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleAddField}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Map
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Land</p>
              <p className="text-2xl font-bold">{totalArea.toFixed(1)} acres</p>
              <p className="text-xs text-success mt-1">+2.5 acres this year</p>
            </div>
            <Map className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Fields</p>
              <p className="text-2xl font-bold">{fields.filter(f => f.status === 'active').length}</p>
              <p className="text-xs text-success mt-1">Cultivated area</p>
            </div>
            <Crop className="w-8 h-8 text-success opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Soil Health</p>
              <p className="text-2xl font-bold">{Math.round(fields.reduce((sum, f) => sum + f.soilHealth, 0) / fields.length)}%</p>
              <p className="text-xs text-success mt-1">+5% improvement</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500 opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Water Efficiency</p>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-xs text-success mt-1">+12% from last year</p>
            </div>
            <Droplet className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('map')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === 'map' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Map View
        </button>
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setView('analytics')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === 'analytics' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Map View */}
      {view === 'map' && (
        <Card className="min-h-[500px]">
          <div className="relative">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50">
                <Layers className="w-4 h-4" />
              </button>
            </div>
            
            {/* Map placeholder - in production, integrate with Leaflet or Google Maps */}
            <div className="bg-gray-100 rounded-lg h-[500px] flex items-center justify-center">
              <div className="text-center">
                <Map className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Interactive Map View</p>
                <p className="text-sm text-gray-400 mt-2">Fields visualized with boundaries and soil data</p>
                <div className="flex gap-4 mt-4 justify-center">
                  {fields.map(field => (
                    <div key={field.id} className="flex items-center gap-2 text-sm">
                      <div className={`w-3 h-3 rounded-full ${field.status === 'active' ? 'bg-success' : 'bg-gray-400'}`} />
                      <span>{field.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-4">
          {fields.map(field => (
            <Card key={field.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${field.status === 'active' ? 'bg-success animate-pulse' : 'bg-gray-400'}`} />
                    <h3 className="text-lg font-semibold">{field.name}</h3>
                    <span className="badge badge-info">{field.crop || 'Fallow'}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="font-medium">{field.size} {field.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Soil Type</p>
                      <p className="font-medium">{field.soilType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Soil Health</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                          <div className="bg-primary rounded-full h-2" style={{ width: `${field.soilHealth}%` }} />
                        </div>
                        <span className="text-sm font-medium">{field.soilHealth}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Moisture</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                          <div className="bg-blue-500 rounded-full h-2" style={{ width: `${field.moisture}%` }} />
                        </div>
                        <span className="text-sm font-medium">{field.moisture}%</span>
                      </div>
                    </div>
                  </div>

                  {field.history && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">Recent History</p>
                      <div className="flex gap-4 text-sm">
                        {field.history.map((h, idx) => (
                          <div key={idx}>
                            <span className="text-gray-600">{h.season}:</span>
                            <span className="font-medium ml-1">{h.crop}</span>
                            <span className="text-gray-500 text-xs ml-1">({h.yield})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => handleEditField(field)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Analytics View */}
      {view === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Field Performance</h3>
            <div className="space-y-4">
              {fields.map(field => (
                <div key={field.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{field.name}</span>
                    <span className="text-sm text-gray-500">Productivity: {field.soilHealth}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${field.soilHealth}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Water Usage</span>
                  <span className="text-sm text-gray-500">2,450 L/day</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 rounded-full h-2" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Fertilizer Efficiency</span>
                  <span className="text-sm text-gray-500">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 rounded-full h-2" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add/Edit Field Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {selectedField ? 'Edit Field' : 'Add New Field'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                  <input type="text" className="input-field" defaultValue={selectedField?.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size (acres)</label>
                  <input type="number" className="input-field" defaultValue={selectedField?.size} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                  <select className="input-field" defaultValue={selectedField?.soilType}>
                    <option>Clay Loam</option>
                    <option>Sandy Loam</option>
                    <option>Alluvial</option>
                    <option>Black Soil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop to Plant</label>
                  <select className="input-field" defaultValue={selectedField?.crop}>
                    <option>Rice</option>
                    <option>Wheat</option>
                    <option>Maize</option>
                    <option>Cotton</option>
                    <option>Fallow</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="primary" className="flex-1">
                    {selectedField ? 'Update' : 'Create'}
                  </Button>
                  <Button variant="secondary" onClick={() => setShowFieldModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}