import { useState } from 'react'
import { 
  FlaskConical, TrendingUp, AlertTriangle, CheckCircle,
  Upload, Camera, Search, FileText, Download, Calendar,
  Droplet, Thermometer, Layers, Microscope
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function SoilTesting() {
  const [activeTab, setActiveTab] = useState('results')
  const [selectedField, setSelectedField] = useState('north')

  const soilTests = [
    {
      id: 1,
      field: 'North Field',
      date: '2024-03-30',
      parameters: {
        pH: 6.8,
        nitrogen: 45,
        phosphorus: 32,
        potassium: 28,
        organicMatter: 2.5,
        moisture: 65
      },
      recommendations: [
        'Add organic compost to improve nitrogen levels',
        'pH is optimal for rice cultivation',
        'Consider adding phosphorous fertilizer'
      ],
      status: 'good'
    },
    {
      id: 2,
      field: 'South Field',
      date: '2024-03-28',
      parameters: {
        pH: 7.2,
        nitrogen: 38,
        phosphorus: 28,
        potassium: 35,
        organicMatter: 1.8,
        moisture: 58
      },
      recommendations: [
        'Nitrogen levels slightly low - apply urea',
        'Increase organic matter through mulching',
        'Soil structure good for wheat'
      ],
      status: 'needs_attention'
    }
  ]

  const getParameterStatus = (value, type) => {
    const ranges = {
      pH: { min: 5.5, max: 7.5, optimal: 6.5 },
      nitrogen: { min: 30, max: 60, optimal: 45 },
      phosphorus: { min: 20, max: 50, optimal: 35 },
      potassium: { min: 25, max: 55, optimal: 40 },
      organicMatter: { min: 1.5, max: 3.5, optimal: 2.5 },
      moisture: { min: 40, max: 80, optimal: 60 }
    }
    
    const range = ranges[type]
    if (value < range.min) return 'low'
    if (value > range.max) return 'high'
    return 'optimal'
  }

  const currentTest = soilTests.find(t => t.field.toLowerCase() === selectedField) || soilTests[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Soil Testing</h1>
          <p className="text-gray-600 mt-1">Comprehensive soil analysis and recommendations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary">
            <Upload className="w-4 h-4 mr-2" />
            New Test
          </Button>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover className="text-center cursor-pointer">
          <Camera className="w-8 h-8 mx-auto text-primary mb-2" />
          <h3 className="font-semibold">Scan with Camera</h3>
          <p className="text-sm text-gray-500">Quick soil analysis via image</p>
        </Card>
        <Card hover className="text-center cursor-pointer">
          <Microscope className="w-8 h-8 mx-auto text-primary mb-2" />
          <h3 className="font-semibold">Lab Test Results</h3>
          <p className="text-sm text-gray-500">Upload professional test results</p>
        </Card>
        <Card hover className="text-center cursor-pointer">
          <FileText className="w-8 h-8 mx-auto text-primary mb-2" />
          <h3 className="font-semibold">View History</h3>
          <p className="text-sm text-gray-500">Past soil test records</p>
        </Card>
      </div>

      {/* Field Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['north', 'south', 'east', 'west'].map(field => (
          <button
            key={field}
            onClick={() => setSelectedField(field)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              selectedField === field
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {field} Field
          </button>
        ))}
      </div>

      {/* Test Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Soil Parameters</h3>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Last tested: {currentTest.date}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.entries(currentTest.parameters).map(([key, value]) => {
              const status = getParameterStatus(value, key)
              const statusColor = status === 'optimal' ? 'text-success' : status === 'low' ? 'text-warning' : 'text-danger'
              
              return (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <span className={`text-sm font-medium ${statusColor}`}>
                      {value} {key === 'pH' ? '' : 'mg/kg'}
                      {status !== 'optimal' && (
                        <span className="text-xs ml-1">
                          ({status === 'low' ? 'Low' : 'High'})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 transition-all ${
                        status === 'optimal' ? 'bg-success' : status === 'low' ? 'bg-warning' : 'bg-danger'
                      }`}
                      style={{ width: `${(value / (key === 'pH' ? 8 : 100)) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recommendations */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <div className="space-y-3">
            {currentTest.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Next Testing Due</p>
                <p className="text-sm text-blue-800">June 15, 2024 (75 days)</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Historical Data */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Historical Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm">Date</th>
                <th className="px-4 py-2 text-left text-sm">pH</th>
                <th className="px-4 py-2 text-left text-sm">Nitrogen</th>
                <th className="px-4 py-2 text-left text-sm">Phosphorus</th>
                <th className="px-4 py-2 text-left text-sm">Potassium</th>
                <th className="px-4 py-2 text-left text-sm">Organic Matter</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {soilTests.map(test => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{test.date}</td>
                  <td className="px-4 py-2 text-sm">{test.parameters.pH}</td>
                  <td className="px-4 py-2 text-sm">{test.parameters.nitrogen}</td>
                  <td className="px-4 py-2 text-sm">{test.parameters.phosphorus}</td>
                  <td className="px-4 py-2 text-sm">{test.parameters.potassium}</td>
                  <td className="px-4 py-2 text-sm">{test.parameters.organicMatter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}