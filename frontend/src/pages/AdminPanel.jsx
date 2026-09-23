import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, Settings, Database, Activity, BarChart3,
  Plus, Edit2, Trash2, Eye, Search, Filter, Download,
  Upload, X, RefreshCw,
  Sprout, Map, TrendingUp, GraduationCap, Wifi,
  Store, Package, CheckCircle2, XCircle, Clock,
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'
import { useAuthContext } from '../context/AuthContext'
import { marketplaceAdminAPI } from '../services/api'

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback

export default function AdminPanel() {
  const navigate = useNavigate()
  const {
    users,
    fetchUsers,
    adminAddUser,
    adminUpdateUser,
    adminDeleteUser,
  } = useAuthContext()

  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('add')
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    ;(async () => {
      setUsersLoading(true)
      await fetchUsers()
      setUsersLoading(false)
    })()
  }, [fetchUsers])

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

  const analytics = {
    totalUsers: users.length,
    activeSensors: sensors.filter((s) => s.status === 'active').length,
    totalFarms: users.filter((u) => (u.userType || '').toUpperCase() === 'FARMER').length,
    cropsPlanted: crops.length,
  }

  const stats = [
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, change: '+12%', tone: 'blue' },
    { label: 'Active Sensors', value: analytics.activeSensors, icon: Activity, change: '+5%', tone: 'green' },
    { label: 'Total Farmers', value: analytics.totalFarms, icon: Map, change: '+8%', tone: 'purple' },
    { label: 'Crops Tracked', value: analytics.cropsPlanted, icon: Sprout, change: '+15%', tone: 'orange' },
  ]

  const toneStyles = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'sellerRequests', label: 'Seller Requests', icon: Store },
    { id: 'productApprovals', label: 'Product Approvals', icon: Package },
    { id: 'sensors', label: 'Sensor Management', icon: Wifi },
    { id: 'crops', label: 'Crop Database', icon: Sprout },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ]

  const [pendingSellers, setPendingSellers] = useState([])
  const [pendingSellersLoaded, setPendingSellersLoaded] = useState(false)
  const [pendingSellersLoading, setPendingSellersLoading] = useState(false)

  const [pendingProducts, setPendingProducts] = useState([])
  const [pendingProductsLoaded, setPendingProductsLoaded] = useState(false)
  const [pendingProductsLoading, setPendingProductsLoading] = useState(false)

  const [moderationActionId, setModerationActionId] = useState(null)

  const loadPendingSellers = async () => {
    setPendingSellersLoading(true)
    try {
      const res = await marketplaceAdminAPI.getPendingSellers()
      setPendingSellers(res.data?.data ?? res.data ?? [])
      setPendingSellersLoaded(true)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not load seller requests'))
    } finally {
      setPendingSellersLoading(false)
    }
  }

  const loadPendingProducts = async () => {
    setPendingProductsLoading(true)
    try {
      const res = await marketplaceAdminAPI.getPendingProducts()
      setPendingProducts(res.data?.data ?? res.data ?? [])
      setPendingProductsLoaded(true)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not load product approvals'))
    } finally {
      setPendingProductsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'sellerRequests' && !pendingSellersLoaded) loadPendingSellers()
    if (activeTab === 'productApprovals' && !pendingProductsLoaded) loadPendingProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleSellerAction = async (id, action) => {
    let reason
    if (action === 'reject' || action === 'suspend') {
      reason =
        window.prompt(
          `Reason for ${action === 'reject' ? 'rejecting' : 'suspending'} this seller (shown to them):`
        ) || undefined
      if (reason === undefined) return
    }
    setModerationActionId(id)
    try {
      const call = {
        approve: () => marketplaceAdminAPI.approveSeller(id),
        reject: () => marketplaceAdminAPI.rejectSeller(id, reason),
        suspend: () => marketplaceAdminAPI.suspendSeller(id, reason),
        verify: () => marketplaceAdminAPI.verifySeller(id),
      }[action]
      const res = await call()
      toast.success(res.data?.message || 'Done')
      setPendingSellers((prev) =>
        action === 'approve' || action === 'reject'
          ? prev.filter((s) => s.id !== id)
          : prev
      )
      if (action !== 'approve' && action !== 'reject') await loadPendingSellers()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Action failed'))
    } finally {
      setModerationActionId(null)
    }
  }

  const handleProductAction = async (id, action) => {
    let reason
    if (action === 'reject' || action === 'suspend') {
      reason =
        window.prompt(
          `Reason for ${action === 'reject' ? 'rejecting' : 'suspending'} this product (shown to the seller):`
        ) || undefined
      if (reason === undefined) return
    }
    setModerationActionId(id)
    try {
      const call = {
        approve: () => marketplaceAdminAPI.approveProduct(id),
        reject: () => marketplaceAdminAPI.rejectProduct(id, reason),
        suspend: () => marketplaceAdminAPI.suspendProduct(id, reason),
      }[action]
      const res = await call()
      toast.success(res.data?.message || 'Done')
      setPendingProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      toast.error(getErrorMessage(err, 'Action failed'))
    } finally {
      setModerationActionId(null)
    }
  }

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
      if (activeTab === 'users') {
        await adminDeleteUser(id)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 300))

      switch (activeTab) {
        case 'sensors':
          setSensors((prev) => prev.filter((s) => s.id !== id))
          break
        case 'crops':
          setCrops((prev) => prev.filter((c) => c.id !== id))
          break
      }
      toast.success('Item deleted successfully')
    } catch (error) {
      toast.error('Failed to delete item')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (activeTab === 'users') {
        const payload = { ...formData }

        if (modalType === 'edit' && !payload.password) {
          delete payload.password
        }

        const result =
          modalType === 'add'
            ? await adminAddUser(payload)
            : await adminUpdateUser(selectedItem.id, payload)

        if (result.success) {
          setShowModal(false)
        }
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 300))

      if (modalType === 'add') {
        switch (activeTab) {
          case 'sensors': {
            const newId = Math.max(0, ...sensors.map((s) => s.id)) + 1
            setSensors((prev) => [...prev, { ...formData, id: newId }])
            break
          }
          case 'crops': {
            const newId = Math.max(0, ...crops.map((c) => c.id)) + 1
            setCrops((prev) => [...prev, { ...formData, id: newId }])
            break
          }
        }
        toast.success('Item added successfully')
      } else {
        switch (activeTab) {
          case 'sensors':
            setSensors((prev) =>
              prev.map((s) =>
                s.id === selectedItem.id ? { ...formData, id: selectedItem.id } : s
              )
            )
            break
          case 'crops':
            setCrops((prev) =>
              prev.map((c) =>
                c.id === selectedItem.id ? { ...formData, id: selectedItem.id } : c
              )
            )
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
      case 'users':
        return users
      case 'sensors':
        return sensors
      case 'crops':
        return crops
      default:
        return []
    }
  }

  const getFormFields = () => {
    switch (activeTab) {
      case 'users':
        return [
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            required: modalType === 'add',
          },
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
      default:
        return []
    }
  }

  const renderTable = () => {
    const data = getCurrentData()
    const filteredData = data.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    const paginatedData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )

    if (activeTab === 'users' && usersLoading) {
      return (
        <div className="space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-slate-100 dark:bg-white/5"
            />
          ))}
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
            <Database className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            No data available
          </p>
          <Button variant="primary" className="mt-4" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      )
    }

    const columnsByTab = {
      users: ['name', 'email', 'role', 'userType'],
      sensors: ['name', 'type', 'location', 'status', 'battery'],
      crops: ['name', 'season', 'duration', 'waterReq'],
    }
    const columns =
      columnsByTab[activeTab] ||
      Object.keys(paginatedData[0] || {}).filter((key) => key !== 'id')

    if (filteredData.length === 0) {
      return (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            No results match "{searchTerm}"
          </p>
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-white/5">
            <tr>
              {columns.map((key) => (
                <th
                  key={key}
                  className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
              <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/5"
              >
                {columns.map((key) => {
                  const value = item[key]
                  return (
                    <td
                      key={key}
                      className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200"
                    >
                      {activeTab === 'users' && key === 'role' ? (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${
                            value === 'ADMIN'
                              ? 'bg-red-50 text-red-700 ring-red-500/20 dark:bg-red-500/10 dark:text-red-400'
                              : 'bg-blue-50 text-blue-700 ring-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400'
                          }`}
                        >
                          {value}
                        </span>
                      ) : activeTab === 'users' && key === 'userType' ? (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${
                            value === 'ADMIN'
                              ? 'bg-red-50 text-red-700 ring-red-500/20 dark:bg-red-500/10 dark:text-red-400'
                              : value === 'EXPERT'
                                ? 'bg-blue-50 text-blue-700 ring-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400'
                                : 'bg-green-50 text-green-700 ring-green-500/20 dark:bg-green-500/10 dark:text-green-400'
                          }`}
                        >
                          {value}
                        </span>
                      ) : Array.isArray(value) ? (
                        value.join(', ')
                      ) : (
                        value ?? <span className="text-slate-400">—</span>
                      )}
                    </td>
                  )
                })}
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-1">
                    {activeTab === 'users' && (
                      <button
                        onClick={() => navigate(`/admin/users/${item.id}`)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                        title="View complete profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {activeTab === 'users' &&
                      (item.userType || '').toUpperCase() !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleExpertAccess(item)}
                          className={`rounded-lg p-1.5 transition-colors ${
                            (item.userType || '').toUpperCase() === 'EXPERT'
                              ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10'
                              : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10'
                          }`}
                          title={
                            (item.userType || '').toUpperCase() === 'EXPERT'
                              ? 'Revoke expert access'
                              : 'Grant expert access'
                          }
                        >
                          <GraduationCap className="h-4 w-4" />
                        </button>
                      )}
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-lg p-1.5 text-blue-500 transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length > itemsPerPage && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 dark:border-white/10">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
              {filteredData.length} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                onClick={() => setCurrentPage((prev) => prev + 1)}
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Complete system management and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="primary" size="sm" onClick={() => fetchUsers()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <Card key={idx} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-green-600 dark:text-green-400">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset ring-slate-900/5 ${
                    toneStyles[stat.tone]
                  }`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="overflow-x-auto border-b border-slate-200 dark:border-white/10">
        <nav className="-mb-px flex gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setCurrentPage(1)
                setSearchTerm('')
              }}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'border-green-600 text-green-700 dark:border-green-500 dark:text-green-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Seller Requests */}
      {activeTab === 'sellerRequests' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sellers awaiting approval to start listing on the marketplace.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={loadPendingSellers}
              disabled={pendingSellersLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${pendingSellersLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>

          {pendingSellersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5"
                />
              ))}
            </div>
          ) : pendingSellers.length === 0 ? (
            <Card className="py-12 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
                <Store className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                No pending seller requests
              </p>
              <p className="mt-1 text-xs text-slate-400">
                New applications will appear here
              </p>
            </Card>
          ) : (
            pendingSellers.map((s) => (
              <Card key={s.id}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {s.shopName}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {s.sellerName} • {s.sellerType?.replaceAll('_', ' ')}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {s.email} {s.phone && `• ${s.phone}`}
                    </p>
                    {s.location && (
                      <p className="mt-1 text-xs text-slate-400">{s.location}</p>
                    )}
                    {s.description && (
                      <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      loading={moderationActionId === s.id}
                      onClick={() => handleSellerAction(s.id, 'approve')}
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={moderationActionId === s.id}
                      onClick={() => handleSellerAction(s.id, 'reject')}
                    >
                      <XCircle className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Product Approvals */}
      {activeTab === 'productApprovals' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              New or edited listings awaiting approval before they go live.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={loadPendingProducts}
              disabled={pendingProductsLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${pendingProductsLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>

          {pendingProductsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5"
                />
              ))}
            </div>
          ) : pendingProducts.length === 0 ? (
            <Card className="py-12 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                No products waiting for approval
              </p>
              <p className="mt-1 text-xs text-slate-400">
                New listings will appear here
              </p>
            </Card>
          ) : (
            pendingProducts.map((p) => (
              <Card key={p.id}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {p.title}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {p.sellerShopName} • {p.category}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Rs. {p.price} / {p.unit} • {p.stock} in stock
                    </p>
                    {p.description && (
                      <p className="mt-2 line-clamp-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
                        {p.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      loading={moderationActionId === p.id}
                      onClick={() => handleProductAction(p.id, 'approve')}
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={moderationActionId === p.id}
                      onClick={() => handleProductAction(p.id, 'reject')}
                    >
                      <XCircle className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Management Content */}
      {['users', 'sensors', 'crops'].includes(activeTab) && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <Button variant="primary" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
            <Button variant="secondary" disabled title="Coming soon">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="secondary" disabled title="Coming soon">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </div>

          <Card noPadding className="overflow-hidden">
            {renderTable()}
          </Card>
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
              User Growth
            </h3>
            <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5">
              <BarChart3 className="h-12 w-12 text-slate-300" />
              <span className="ml-2 text-sm text-slate-500">
                Chart Component Here
              </span>
            </div>
          </Card>
          <Card>
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
              Sensor Activity
            </h3>
            <div className="space-y-4">
              {sensors.map((sensor) => (
                <div key={sensor.id}>
                  <div className="mb-1.5 flex justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {sensor.name}
                    </span>
                    <span className="text-sm text-slate-500">{sensor.value}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                      style={{ width: sensor.battery }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <Card>
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
            System Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 py-3 dark:border-white/10">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Email Notifications
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Receive email alerts for system events
                </p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600 transition-colors">
                <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white shadow-sm transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 py-3 dark:border-white/10">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Auto Backup
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automatically backup data daily
                </p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors dark:bg-white/10">
                <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white shadow-sm transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Data Retention Period
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Keep historical data for
                </p>
              </div>
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-[#142019]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {modalType === 'add' ? 'Add New' : 'Edit'} {activeTab.slice(0, -1)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5"
            >
              {getFormFields().map((field) => (
                <div key={field.name}>
                  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                    {field.label}{' '}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.name]: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.name]: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      required={field.required}
                      placeholder={
                        field.name === 'password' && modalType === 'edit'
                          ? 'Leave blank to keep current password'
                          : undefined
                      }
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  loading={loading}
                >
                  {modalType === 'add' ? 'Create' : 'Update'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}