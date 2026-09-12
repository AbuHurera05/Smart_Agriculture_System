import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, Settings, Database, Shield, Activity, BarChart3, 
  Plus, Edit2, Trash2, Eye, Search, Filter, Download, 
  Upload, X, Check, RefreshCw, UserCheck, UserX, Clock,
  Sprout, Newspaper, Map, TrendingUp, GraduationCap, Wifi,
  Droplet
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'
import { useAuthContext } from '../context/AuthContext'
import useDataStore from '../store/useDataStore'
import { workshopAPI } from '../services/api'
import { workshopFromResponse, workshopToRequest } from '../utils/workshopMapper'

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback

export default function AdminPanel() {
  const navigate = useNavigate()
  const {
    users, fetchUsers, adminAddUser, adminUpdateUser, adminDeleteUser,
    expertRequests, fetchExpertRequests, approveExpertRequest, rejectExpertRequest,
  } = useAuthContext()
  const {
    news, fetchNews, addNews, updateNews, deleteNews, togglePublishNews,
  } = useDataStore()

  // Workshops are real expert-service records (GET/POST/PUT/DELETE
  // /experts/workshops) - the ADMIN role is authorized for the same
  // create/update/delete endpoints as EXPERT, so this tab talks to the
  // same workshopAPI as ExpertDashboard.jsx / TrainingWorkshops.jsx.
  const [workshops, setWorkshops] = useState([])

  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('add')
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const loadWorkshops = async () => {
    try {
      const response = await workshopAPI.getAll()
      setWorkshops((response.data?.data || []).map(workshopFromResponse))
    } catch (error) {
      console.error('Failed to load workshops:', error)
      toast.error(getErrorMessage(error, 'Could not load workshops'))
    }
  }

  // `users` and `expertRequests` live in AuthContext and are backed by the
  // real backend (GET /admin/users, GET /experts/requests) - load them once
  // when the panel mounts. `workshops` and `news` are backed by their own
  // services too (expert-service, news-service).
  useEffect(() => {
    fetchUsers()
    fetchExpertRequests()
    loadWorkshops()
    fetchNews()
  }, [fetchUsers, fetchExpertRequests, fetchNews])

  // Data States (sensors & crops are still frontend-only reference data -
  // the backend has no admin CRUD endpoints for them yet, only read-only
  // GET /crops and a single-reading GET /iot/sensors. Per-user farm data
  // lives in the individual User Detail view, also still mocked for the
  // same reason.)
  const [sensors, setSensors] = useState([
    { id: 1, name: 'Field Sensor A1', type: 'Soil Moisture', location: 'North Field', status: 'active', battery: '85%', lastReading: '2026-07-27 10:30', value: '65%' },
    { id: 2, name: 'Weather Station', type: 'Weather', location: 'Central', status: 'active', battery: '92%', lastReading: '2026-07-27 10:28', value: '28°C' },
    { id: 3, name: 'Irrigation Controller', type: 'Irrigation', location: 'South Field', status: 'maintenance', battery: '67%', lastReading: '2026-07-27 09:15', value: 'Active' },
  ])

  const [crops, setCrops] = useState([
    { id: 1, name: 'Rice', season: 'Kharif', duration: '120 days', waterReq: 'High', tempRange: '20-35°C', soilType: 'Clay loam', yield: '2.5 tons/acre' },
    { id: 2, name: 'Wheat', season: 'Rabi', duration: '100 days', waterReq: 'Medium', tempRange: '15-25°C', soilType: 'Loamy', yield: '3 tons/acre' },
    { id: 3, name: 'Maize', season: 'Kharif', duration: '90 days', waterReq: 'Medium', tempRange: '21-27°C', soilType: 'Well-drained loam', yield: '2.8 tons/acre' },
  ])

  // Backend UserResponse has `role` (security role: ADMIN/USER) and
  // `userType` (business role: ADMIN/FARMER/EXPERT). "Farmer" counts and
  // badges use userType, not role.
  const analytics = {
    totalUsers: users.length,
    activeSensors: sensors.filter(s => s.status === 'active').length,
    totalFarms: users.filter(u => (u.userType || '').toUpperCase() === 'FARMER').length,
    cropsPlanted: crops.length,
    waterSaved: '1.2M L',
    yieldIncrease: '23%',
    revenue: '$45.2K',
    systemUptime: '99.9%'
  }

  const pendingExpertRequests = expertRequests.filter(r => r.status === 'pending')

  const stats = [
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, change: '+12%', color: 'text-blue-600' },
    { label: 'Active Sensors', value: analytics.activeSensors, icon: Activity, change: '+5%', color: 'text-green-600' },
    { label: 'Total Farmers', value: analytics.totalFarms, icon: Map, change: '+8%', color: 'text-purple-600' },
    { label: 'Crops Tracked', value: analytics.cropsPlanted, icon: Sprout, change: '+15%', color: 'text-orange-600' },
    { label: 'Water Saved', value: analytics.waterSaved, icon: Droplet, change: '+23%', color: 'text-cyan-600' },
    { label: 'Yield Increase', value: analytics.yieldIncrease, icon: TrendingUp, change: '+5%', color: 'text-emerald-600' },
    { label: 'Revenue', value: analytics.revenue, icon: Database, change: '+18%', color: 'text-yellow-600' },
    { label: 'System Uptime', value: analytics.systemUptime, icon: Shield, change: '+0.1%', color: 'text-indigo-600' },
  ]

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'expertRequests', label: 'Expert Requests', icon: GraduationCap, badge: pendingExpertRequests.length },
    { id: 'sensors', label: 'Sensor Management', icon: Wifi },
    { id: 'crops', label: 'Crop Database', icon: Sprout },
    { id: 'news', label: 'News Management', icon: Newspaper },
    { id: 'workshops', label: 'Workshops', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ]

  // ---------------- Generic CRUD (users / sensors / crops / news / workshops) ----------------

  const [formData, setFormData] = useState({})

  const handleAdd = () => {
    setModalType('add')
    setFormData({})
    setSelectedItem(null)
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setModalType('edit')
    setSelectedItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    setLoading(true)

    try {
      // Users are real backend records - adminDeleteUser already shows its
      // own success/error toast and updates the `users` list on success.
      if (activeTab === 'users') {
        await adminDeleteUser(id)
        return
      }

      // Workshops are also real backend records (DELETE /experts/workshops/{id}).
      if (activeTab === 'workshops') {
        await workshopAPI.delete(id)
        setWorkshops(prev => prev.filter(w => w.id !== id))
        toast.success('Item deleted successfully')
        return
      }

      // Everything else here is still frontend-only mock/store data.
      await new Promise(resolve => setTimeout(resolve, 300))

      switch (activeTab) {
        case 'sensors':
          setSensors(prev => prev.filter(s => s.id !== id))
          break
        case 'crops':
          setCrops(prev => prev.filter(c => c.id !== id))
          break
        case 'news':
          deleteNews(id)
          break
      }
      toast.success('Item deleted successfully')
    } catch (error) {
      toast.error(activeTab === 'workshops' ? getErrorMessage(error, 'Failed to delete item') : 'Failed to delete item')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Users are real backend records - adminAddUser/adminUpdateUser
      // already show their own success/error toast, so only close the
      // modal here and skip the extra toast.
      if (activeTab === 'users') {
        const payload = { ...formData }

        // Don't send a blank password on edit - the backend only requires
        // one when creating a new user.
        if (modalType === 'edit' && !payload.password) {
          delete payload.password
        }

        const result = modalType === 'add'
          ? await adminAddUser(payload)
          : await adminUpdateUser(selectedItem.id, payload)

        if (result.success) {
          setShowModal(false)
        }
        return
      }

      // Workshops are also real backend records (POST/PUT /experts/workshops).
      if (activeTab === 'workshops') {
        const payload = workshopToRequest(formData)

        if (modalType === 'add') {
          const response = await workshopAPI.create(payload)
          setWorkshops(prev => [workshopFromResponse(response.data?.data), ...prev])
        } else {
          const response = await workshopAPI.update(selectedItem.id, payload)
          setWorkshops(prev => prev.map(w => (w.id === selectedItem.id ? workshopFromResponse(response.data?.data) : w)))
        }

        toast.success(modalType === 'add' ? 'Item added successfully' : 'Item updated successfully')
        setShowModal(false)
        return
      }

      // Everything else here is still frontend-only mock/store data.
      await new Promise(resolve => setTimeout(resolve, 300))

      if (modalType === 'add') {
        switch (activeTab) {
          case 'sensors': {
            const newId = Math.max(0, ...sensors.map(s => s.id)) + 1
            setSensors(prev => [...prev, { ...formData, id: newId }])
            break
          }
          case 'crops': {
            const newId = Math.max(0, ...crops.map(c => c.id)) + 1
            setCrops(prev => [...prev, { ...formData, id: newId }])
            break
          }
          case 'news':
            addNews({ ...formData, date: new Date().toISOString().split('T')[0], image: formData.image || '📰' })
            break
        }
        toast.success('Item added successfully')
      } else {
        switch (activeTab) {
          case 'sensors':
            setSensors(prev => prev.map(s => s.id === selectedItem.id ? { ...formData, id: selectedItem.id } : s))
            break
          case 'crops':
            setCrops(prev => prev.map(c => c.id === selectedItem.id ? { ...formData, id: selectedItem.id } : c))
            break
          case 'news':
            updateNews(selectedItem.id, formData)
            break
        }
        toast.success('Item updated successfully')
      }

      setShowModal(false)
    } catch (error) {
      toast.error(activeTab === 'workshops' ? getErrorMessage(error, 'Operation failed') : 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  // Directly grant/revoke a user's expert access, independent of the
  // apply/approve/reject workflow - useful when an admin wants to demote
  // an existing expert, or promote a farmer without them applying first.
  // There's no dedicated backend endpoint for this, so it just updates
  // userType via the same PUT /admin/users/{id} call the edit form uses.
  const handleToggleExpertAccess = async (targetUser) => {
    const isExpert = (targetUser.userType || '').toUpperCase() === 'EXPERT'
    const nextUserType = isExpert ? 'FARMER' : 'EXPERT'

    const confirmed = window.confirm(
      isExpert
        ? `Revoke expert access for ${targetUser.name}? They will become a farmer.`
        : `Grant expert access to ${targetUser.name}?`
    )
    if (!confirmed) return

    setLoading(true)
    try {
      await adminUpdateUser(targetUser.id, {
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        userType: nextUserType,
        phone: targetUser.phone,
        location: targetUser.location,
      })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'users': return users
      case 'sensors': return sensors
      case 'crops': return crops
      case 'news': return news
      case 'workshops': return workshops
      default: return []
    }
  }

  const getFormFields = () => {
    switch (activeTab) {
      case 'users':
        return [
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          // Only required when creating a new user - AdminUserRequest.password is optional on edit.
          { name: 'password', label: 'Password', type: 'password', required: modalType === 'add' },
          { name: 'role', label: 'Security Role', type: 'select', options: ['ADMIN', 'USER'], required: true },
          { name: 'userType', label: 'User Type', type: 'select', options: ['ADMIN', 'FARMER', 'EXPERT'], required: true },
          { name: 'phone', label: 'Phone', type: 'text' },
          { name: 'location', label: 'Location', type: 'text' },
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
          { name: 'category', label: 'Category', type: 'select', options: ['Policy', 'Technology', 'Market', 'Events', 'Research'], required: true },
          { name: 'summary', label: 'Summary', type: 'text', required: true },
          { name: 'content', label: 'Full Content', type: 'textarea', required: true },
          { name: 'author', label: 'Author', type: 'text', required: true },
          { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        ]
      case 'workshops':
        return [
          { name: 'title', label: 'Workshop Title', type: 'text', required: true },
          { name: 'date', label: 'Date', type: 'date', required: true },
          { name: 'time', label: 'Time', type: 'time', required: true },
          { name: 'venue', label: 'Venue', type: 'text', required: true },
          { name: 'type', label: 'Type', type: 'select', options: ['online', 'in-person', 'hybrid'], required: true },
          { name: 'capacity', label: 'Capacity', type: 'number', required: true },
          { name: 'price', label: 'Price (₹, 0 for free)', type: 'number', required: true },
          { name: 'topics', label: 'Topics (comma separated)', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'status', label: 'Status', type: 'select', options: ['upcoming', 'ongoing', 'completed', 'cancelled'], required: modalType === 'edit' },
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
          <Button variant="primary" className="mt-4" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      )
    }

    // Columns to actually render per tab (avoid dumping every raw field, e.g. passwords)
    const columnsByTab = {
      users: ['name', 'email', 'role', 'userType', 'expertRequestStatus'],
      sensors: ['name', 'type', 'location', 'status', 'battery'],
      crops: ['name', 'season', 'duration', 'waterReq'],
      news: ['title', 'category', 'status', 'date', 'views'],
      workshops: ['title', 'instructor', 'date', 'status', 'enrolled', 'capacity'],
    }
    const columns = columnsByTab[activeTab] || Object.keys(paginatedData[0] || {}).filter(key => key !== 'id')

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map(key => (
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
                {columns.map((key) => {
                  const value = item[key]
                  return (
                    <td key={key} className="px-6 py-4 text-sm text-gray-900">
                      {activeTab === 'news' && key === 'status' ? (
                        <span className={`badge ${value === 'published' ? 'badge-success' : 'badge-warning'} text-xs capitalize`}>{value}</span>
                      ) : activeTab === 'users' && key === 'role' ? (
                        <span className={`badge ${value === 'ADMIN' ? 'badge-danger' : 'badge-info'} text-xs`}>{value}</span>
                      ) : activeTab === 'users' && key === 'userType' ? (
                        <span className={`badge ${value === 'ADMIN' ? 'badge-danger' : value === 'EXPERT' ? 'badge-info' : 'badge-success'} text-xs capitalize`}>{value}</span>
                      ) : activeTab === 'users' && key === 'expertRequestStatus' ? (
                        value ? <span className={`badge ${value === 'pending' ? 'badge-warning' : value === 'approved' ? 'badge-success' : 'badge-danger'} text-xs capitalize`}>{value}</span> : <span className="text-gray-400">—</span>
                      ) : Array.isArray(value) ? value.join(', ') : (value ?? <span className="text-gray-400">—</span>)}
                    </td>
                  )
                })}
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  {activeTab === 'users' && (
                    <button
                      onClick={() => navigate(`/admin/users/${item.id}`)}
                      className="text-gray-500 hover:text-gray-900 mr-3"
                      title="View complete profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {activeTab === 'news' && (
                    <button
                      onClick={() => { togglePublishNews(item.id); toast.success(item.status === 'published' ? 'Unpublished' : 'Published') }}
                      className="text-gray-500 hover:text-gray-900 mr-3"
                      title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {item.status === 'published' ? <UserX className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                  )}
                  {activeTab === 'users' && (item.userType || '').toUpperCase() !== 'ADMIN' && (
                    <button
                      onClick={() => handleToggleExpertAccess(item)}
                      className={(item.userType || '').toUpperCase() === 'EXPERT' ? 'text-orange-600 hover:text-orange-800 mr-3' : 'text-green-600 hover:text-green-800 mr-3'}
                      title={(item.userType || '').toUpperCase() === 'EXPERT' ? 'Revoke expert access' : 'Grant expert access'}
                    >
                      <GraduationCap className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
          <Button variant="primary" size="sm" onClick={() => { fetchUsers(); fetchExpertRequests() }}>
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
          {pendingExpertRequests.length > 0 && (
            <Card className="lg:col-span-4 border border-yellow-200 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-yellow-700" />
                  <p className="text-sm text-yellow-800">
                    <strong>{pendingExpertRequests.length}</strong> expert application{pendingExpertRequests.length > 1 ? 's' : ''} awaiting your review.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setActiveTab('expertRequests')}>Review Now</Button>
              </div>
            </Card>
          )}
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
              {!!item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Expert Requests Tab */}
      {activeTab === 'expertRequests' && (
        <Card className="overflow-hidden" noPadding>
          {expertRequests.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No expert applications yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expertRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <p className="font-medium text-gray-900">{req.name}</p>
                        <p className="text-gray-500 text-xs">{req.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{req.specialization}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{req.experience}</td>
                      {/* requestDate comes back as an ISO Instant from the backend */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {req.requestDate ? new Date(req.requestDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`badge ${req.status === 'pending' ? 'badge-warning' : req.status === 'approved' ? 'badge-success' : 'badge-danger'} text-xs capitalize flex items-center gap-1 w-fit`}>
                          {req.status === 'pending' && <Clock className="w-3 h-3" />}
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="primary" size="sm" onClick={() => approveExpertRequest(req.id)}>
                              <UserCheck className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => rejectExpertRequest(req.id)}>
                              <UserX className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No action needed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Management Content (users / sensors / crops / news / workshops) */}
      {['users', 'sensors', 'crops', 'news', 'workshops'].includes(activeTab) && (
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
            <Button variant="primary" onClick={handleAdd}>
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
          <Card className="overflow-hidden" noPadding>
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
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="input-field"
                        rows={4}
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="input-field"
                        required={field.required}
                        placeholder={field.name === 'password' && modalType === 'edit' ? 'Leave blank to keep current password' : undefined}
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