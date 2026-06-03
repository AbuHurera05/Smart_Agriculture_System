import { useState, useEffect } from 'react'
import { 
  Users, Settings, Database, Shield, Activity, BarChart3, 
  Plus, Edit2, Trash2, Eye, Search, Filter, Download, 
  Upload, X, Check, AlertCircle, RefreshCw, ChevronDown,
  Smartphone, Droplet, Sprout, CloudRain, Newspaper, Map,
  TrendingUp, GraduationCap, Users as UsersIcon, Wifi
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('add')
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Data States
  const [users, setUsers] = useState([
    { id: 1, name: 'John Farmer', email: 'john@example.com', role: 'farmer', status: 'active', joinDate: '2024-01-15', farmSize: '5 acres', crops: ['Rice', 'Wheat'] },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'expert', status: 'active', joinDate: '2024-01-20', specialization: 'Crop Disease', experience: '8 years' },
    { id: 3, name: 'Mike Brown', email: 'mike@example.com', role: 'admin', status: 'active', joinDate: '2024-01-10', permissions: 'full' },
  ])

  const [sensors, setSensors] = useState([
    { id: 1, name: 'Field Sensor A1', type: 'Soil Moisture', location: 'North Field', status: 'active', battery: '85%', lastReading: '2024-03-31 10:30', value: '65%' },
    { id: 2, name: 'Weather Station', type: 'Weather', location: 'Central', status: 'active', battery: '92%', lastReading: '2024-03-31 10:28', value: '28°C' },
    { id: 3, name: 'Irrigation Controller', type: 'Irrigation', location: 'South Field', status: 'maintenance', battery: '67%', lastReading: '2024-03-31 09:15', value: 'Active' },
  ])

  const [crops, setCrops] = useState([
    { id: 1, name: 'Rice', season: 'Kharif', duration: '120 days', waterReq: 'High', tempRange: '20-35°C', soilType: 'Clay loam', yield: '2.5 tons/acre' },
    { id: 2, name: 'Wheat', season: 'Rabi', duration: '100 days', waterReq: 'Medium', tempRange: '15-25°C', soilType: 'Loamy', yield: '3 tons/acre' },
    { id: 3, name: 'Maize', season: 'Kharif', duration: '90 days', waterReq: 'Medium', tempRange: '21-27°C', soilType: 'Well-drained loam', yield: '2.8 tons/acre' },
  ])

  const [news, setNews] = useState([
    { id: 1, title: 'New Government Subsidy Scheme', category: 'Policy', date: '2024-03-30', status: 'published', views: 1245 },
    { id: 2, title: 'AI Disease Detection Launch', category: 'Technology', date: '2024-03-29', status: 'published', views: 892 },
  ])

  const [workshops, setWorkshops] = useState([
    { id: 1, title: 'Organic Farming Techniques', date: '2024-04-15', venue: 'Online', capacity: 100, enrolled: 45, status: 'upcoming' },
    { id: 2, title: 'Smart Irrigation Workshop', date: '2024-04-20', venue: 'Community Center', capacity: 50, enrolled: 32, status: 'upcoming' },
  ])

  const [analytics, setAnalytics] = useState({
    totalUsers: 1234,
    activeSensors: 56,
    totalFarms: 890,
    cropsPlanted: 2345,
    waterSaved: '1.2M L',
    yieldIncrease: '23%',
    revenue: '$45.2K',
    systemUptime: '99.9%'
  })

  const stats = [
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, change: '+12%', color: 'text-blue-600' },
    { label: 'Active Sensors', value: analytics.activeSensors, icon: Activity, change: '+5%', color: 'text-green-600' },
    { label: 'Total Farms', value: analytics.totalFarms, icon: Map, change: '+8%', color: 'text-purple-600' },
    { label: 'Crops Planted', value: analytics.cropsPlanted, icon: Sprout, change: '+15%', color: 'text-orange-600' },
    { label: 'Water Saved', value: analytics.waterSaved, icon: Droplet, change: '+23%', color: 'text-cyan-600' },
    { label: 'Yield Increase', value: analytics.yieldIncrease, icon: TrendingUp, change: '+5%', color: 'text-emerald-600' },
    { label: 'Revenue', value: analytics.revenue, icon: Database, change: '+18%', color: 'text-yellow-600' },
    { label: 'System Uptime', value: analytics.systemUptime, icon: Shield, change: '+0.1%', color: 'text-indigo-600' },
  ]

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'sensors', label: 'Sensor Management', icon: Wifi },
    { id: 'crops', label: 'Crop Database', icon: Sprout },
    { id: 'news', label: 'News Management', icon: Newspaper },
    { id: 'workshops', label: 'Workshops', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ]

  // Form state for CRUD
  const [formData, setFormData] = useState({})

  const handleAdd = (type) => {
    setModalType('add')
    setFormData({})
    setSelectedItem(null)
    setShowModal(true)
  }

  const handleEdit = (item, type) => {
    setModalType('edit')
    setSelectedItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const handleDelete = async (id, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        switch(type) {
          case 'users':
            setUsers(users.filter(u => u.id !== id))
            break
          case 'sensors':
            setSensors(sensors.filter(s => s.id !== id))
            break
          case 'crops':
            setCrops(crops.filter(c => c.id !== id))
            break
          case 'news':
            setNews(news.filter(n => n.id !== id))
            break
          case 'workshops':
            setWorkshops(workshops.filter(w => w.id !== id))
            break
        }
        toast.success('Item deleted successfully')
      } catch (error) {
        toast.error('Failed to delete item')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (modalType === 'add') {
        const newId = Math.max(...getCurrentData().map(item => item.id), 0) + 1
        const newItem = { ...formData, id: newId }
        
        switch(activeTab) {
          case 'users':
            setUsers([...users, newItem])
            break
          case 'sensors':
            setSensors([...sensors, newItem])
            break
          case 'crops':
            setCrops([...crops, newItem])
            break
          case 'news':
            setNews([...news, newItem])
            break
          case 'workshops':
            setWorkshops([...workshops, newItem])
            break
        }
        toast.success('Item added successfully')
      } else {
        switch(activeTab) {
          case 'users':
            setUsers(users.map(u => u.id === selectedItem.id ? { ...formData, id: selectedItem.id } : u))
            break
          case 'sensors':
            setSensors(sensors.map(s => s.id === selectedItem.id ? { ...formData, id: selectedItem.id } : s))
            break
          case 'crops':
            setCrops(crops.map(c => c.id === selectedItem.id ? { ...formData, id: selectedItem.id } : c))
            break
          case 'news':
            setNews(news.map(n => n.id === selectedItem.id ? { ...formData, id: selectedItem.id } : n))
            break
          case 'workshops':
            setWorkshops(workshops.map(w => w.id === selectedItem.id ? { ...formData, id: selectedItem.id } : w))
            break
        }
        toast.success('Item updated successfully')
      }
      
      setShowModal(false)
    } catch (error) {
      toast.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentData = () => {
    switch(activeTab) {
      case 'users': return users
      case 'sensors': return sensors
      case 'crops': return crops
      case 'news': return news
      case 'workshops': return workshops
      default: return []
    }
  }

  const getFormFields = () => {
    switch(activeTab) {
      case 'users':
        return [
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'role', label: 'Role', type: 'select', options: ['farmer', 'expert', 'admin'], required: true },
          { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'suspended'], required: true },
        ]
      case 'sensors':
        return [
          { name: 'name', label: 'Sensor Name', type: 'text', required: true },
          { name: 'type', label: 'Type', type: 'select', options: ['Soil Moisture', 'Weather', 'Irrigation', 'Temperature'], required: true },
          { name: 'location', label: 'Location', type: 'text', required: true },
          { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'maintenance'], required: true },
        ]
      case 'crops':
        return [
          { name: 'name', label: 'Crop Name', type: 'text', required: true },
          { name: 'season', label: 'Season', type: 'select', options: ['Kharif', 'Rabi', 'Zaid'], required: true },
          { name: 'duration', label: 'Duration', type: 'text', required: true },
          { name: 'waterReq', label: 'Water Requirement', type: 'text', required: true },
        ]
      case 'news':
        return [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'category', label: 'Category', type: 'select', options: ['Policy', 'Technology', 'Market', 'Events'], required: true },
          { name: 'status', label: 'Status', type: 'select', options: ['published', 'draft'], required: true },
        ]
      case 'workshops':
        return [
          { name: 'title', label: 'Workshop Title', type: 'text', required: true },
          { name: 'date', label: 'Date', type: 'date', required: true },
          { name: 'venue', label: 'Venue', type: 'text', required: true },
          { name: 'capacity', label: 'Capacity', type: 'number', required: true },
        ]
      default: return []
    }
  }

  const renderTable = () => {
    const data = getCurrentData()
    const filteredData = data.filter(item => 
      Object.values(item).some(val => 
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    if (data.length === 0) {
      return (
        <div className="text-center py-12">
          <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No data available</p>
          <Button variant="primary" className="mt-4" onClick={() => handleAdd(activeTab)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {Object.keys(paginatedData[0] || {}).filter(key => key !== 'id').map(key => (
                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {Object.entries(item).filter(([key]) => key !== 'id').map(([key, value]) => (
                  <td key={key} className="px-6 py-4 text-sm text-gray-900">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </td>
                ))}
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item, activeTab)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, activeTab)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        {filteredData.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4 px-4 py-3">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Complete system management and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-success mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 bg-opacity-10 rounded-full ${stat.color.replace('text', 'bg')}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setCurrentPage(1)
                setSearchTerm('')
              }}
              className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === item.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Management Content */}
      {activeTab !== 'overview' && activeTab !== 'analytics' && activeTab !== 'settings' && (
        <div>
          {/* Search and Actions Bar */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <Button variant="primary" onClick={() => handleAdd(activeTab)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="secondary">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>

          {/* Data Table */}
          <Card className="overflow-hidden">
            {renderTable()}
          </Card>
        </div>
      )}

      {/* Analytics View */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">User Growth</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <BarChart3 className="w-12 h-12 text-gray-400" />
                <span className="ml-2 text-gray-500">Chart Component Here</span>
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-4">Sensor Activity</h3>
              <div className="space-y-4">
                {sensors.map(sensor => (
                  <div key={sensor.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{sensor.name}</span>
                      <span className="text-sm text-gray-500">{sensor.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: sensor.battery }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Settings View */}
      {activeTab === 'settings' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">System Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email alerts for system events</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Auto Backup</p>
                <p className="text-sm text-gray-500">Automatically backup data daily</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Data Retention Period</p>
                <p className="text-sm text-gray-500">Keep historical data for</p>
              </div>
              <select className="input-field w-32">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* CRUD Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  {modalType === 'add' ? 'Add New' : 'Edit'} {activeTab.slice(0, -1)}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {getFormFields().map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && '*'}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="input-field"
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="input-field"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1" loading={loading}>
                    {modalType === 'add' ? 'Create' : 'Update'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
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