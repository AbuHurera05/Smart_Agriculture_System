import { useState, useEffect, useCallback } from 'react'
import {
  Cpu,
  Wifi,
  WifiOff,
  CheckCircle2,
  Clock,
  UserCheck,
  Plus,
  Trash2,
  RefreshCw,
  FileText,
  MapPin,
  Sprout,
  Check,
  XCircle,
  AlertTriangle,
  Sliders,
  BatteryCharging,
  Droplets,
  Thermometer,
  Layers,
  Phone,
  Mail,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../common/Button'
import Card from '../common/Card'
import { Badge, ConfirmModal, EmptyState, Modal, SectionHeader } from './AdminUi'
import { iotAPI } from '../../services/api'

export default function AdminIotFleet() {
  const [subTab, setSubTab] = useState('kits') // 'kits' | 'requests' | 'devices'
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Data states
  const [summary, setSummary] = useState({
    totalSetups: 0,
    activeSetups: 0,
    unassignedSetups: 0,
    pendingRequests: 0,
  })
  const [setups, setSetups] = useState([])
  const [requests, setRequests] = useState([])
  const [devices, setDevices] = useState([])

  // Modal states
  const [kitModal, setKitModal] = useState(null) // null or kit object to create
  const [assignModal, setAssignModal] = useState(null) // kit to assign
  const [approveModal, setApproveModal] = useState(null) // request to approve
  const [rejectModal, setRejectModal] = useState(null) // request to decline
  const [unassignModal, setUnassignModal] = useState(null) // kit to unassign
  const [deleteModal, setDeleteModal] = useState(null) // kit to delete

  // Form fields
  const [assignForm, setAssignForm] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    userPhone: '',
    farmName: '',
    location: '',
    cropType: 'Wheat',
  })

  const [approveForm, setApproveForm] = useState({
    assignedSetupCode: '',
    adminNotes: 'Application approved. Hardware kit allocated and ready for dispatch.',
  })

  const [rejectNotes, setRejectNotes] = useState('')

  const loadAll = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    setRefreshing(true)
    try {
      const [sumRes, setupsRes, reqsRes, devRes] = await Promise.allSettled([
        iotAPI.getFleetSummary(),
        iotAPI.getAllSetups(),
        iotAPI.getAllSetupRequests(),
        iotAPI.getSensors(),
      ])

      if (sumRes.status === 'fulfilled' && sumRes.value.data?.data) {
        setSummary(sumRes.value.data.data)
      }
      if (setupsRes.status === 'fulfilled' && Array.isArray(setupsRes.value.data?.data)) {
        setSetups(setupsRes.value.data.data)
      }
      if (reqsRes.status === 'fulfilled' && Array.isArray(reqsRes.value.data?.data)) {
        setRequests(reqsRes.value.data.data)
      }
      if (devRes.status === 'fulfilled' && Array.isArray(devRes.value.data?.data)) {
        setDevices(devRes.value.data.data)
      }
    } catch (err) {
      console.error('Failed to load IoT Fleet:', err)
      toast.error('Could not refresh fleet data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // =========================================================
  // ACTIONS: KITS
  // =========================================================

  const handleCreateKit = async (e) => {
    e.preventDefault()
    try {
      const res = await iotAPI.createKit(kitModal)
      toast.success(res.data?.message || 'New hardware kit registered in inventory')
      setKitModal(null)
      loadAll(true)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create kit')
    }
  }

  const openAssignModal = (kit) => {
    setAssignModal(kit)
    setAssignForm({
      userId: kit.userId || '',
      userName: kit.userName || '',
      userEmail: kit.userEmail || '',
      userPhone: kit.userPhone || '',
      farmName: kit.farmName || '',
      location: kit.location || '',
      cropType: kit.cropType || 'Wheat',
    })
  }

  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    if (!assignModal) return
    try {
      await iotAPI.assignSetup(assignModal.id, {
        userId: assignForm.userId ? Number(assignForm.userId) : null,
        userName: assignForm.userName,
        userEmail: assignForm.userEmail,
        userPhone: assignForm.userPhone,
        farmName: assignForm.farmName,
        location: assignForm.location,
        cropType: assignForm.cropType,
      })
      toast.success(`Kit ${assignModal.setupCode} allocated to ${assignForm.userName || 'Farmer'}!`)
      setAssignModal(null)
      loadAll(true)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to allocate kit')
    }
  }

  const handleUnassignConfirm = async () => {
    if (!unassignModal) return
    try {
      await iotAPI.unassignSetup(unassignModal.id)
      toast.success(`Kit ${unassignModal.setupCode} returned to inventory pool`)
      setUnassignModal(null)
      loadAll(true)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to unassign kit')
    }
  }

  const handleDeleteKitConfirm = async () => {
    if (!deleteModal) return
    try {
      await iotAPI.deleteSetup(deleteModal.id)
      toast.success(`Kit ${deleteModal.setupCode} removed from fleet`)
      setDeleteModal(null)
      loadAll(true)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete kit')
    }
  }

  const handleToggleStatus = async (kit, nextStatus) => {
    try {
      await iotAPI.updateSetupStatus(kit.id, nextStatus)
      toast.success(`Kit ${kit.setupCode} status set to ${nextStatus}`)
      loadAll(true)
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  // =========================================================
  // ACTIONS: FARMER REQUESTS
  // =========================================================

  const openApproveModal = (req) => {
    setApproveModal(req)
    // Suggest first unassigned kit
    const available = setups.find((s) => !s.userId)
    setApproveForm({
      assignedSetupCode: available ? available.setupCode : '',
      adminNotes: 'Application approved. Hardware kit dispatched to farm location.',
    })
  }

  const handleApproveSubmit = async (e) => {
    e.preventDefault()
    if (!approveModal) return
    try {
      await iotAPI.approveSetupRequest(approveModal.id, {
        assignedSetupCode: approveForm.assignedSetupCode,
        adminNotes: approveForm.adminNotes,
      })
      toast.success(`Request approved! Kit ${approveForm.assignedSetupCode} assigned.`)
      setApproveModal(null)
      loadAll(true)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Approval failed')
    }
  }

  const handleRejectSubmit = async (e) => {
    e.preventDefault()
    if (!rejectModal) return
    try {
      await iotAPI.rejectSetupRequest(rejectModal.id, {
        adminNotes: rejectNotes || 'Application declined by administrator.',
      })
      toast.success('Request declined')
      setRejectModal(null)
      setRejectNotes('')
      loadAll(true)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Decline failed')
    }
  }

  const unassignedKits = setups.filter((s) => !s.userId || s.status === 'UNASSIGNED')
  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-green-600 dark:text-green-400" />
            IoT Hardware Fleet &amp; Allocation Hub
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Control field hardware kits, manage farmer allocations, and review new IoT installation applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadAll()}
            leftIcon={<RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh Fleet
          </Button>
          <Button
            size="sm"
            onClick={() =>
              setKitModal({
                setupCode: `KIT-ESP32-00${setups.length + 1}`,
                farmName: 'AsanKisan Central Inventory',
                location: 'Central Warehouse, Karachi',
                cropType: 'General Purpose',
                battery: 'AC Main + Solar',
                notes: 'Pre-tested ESP32 5-sensor kit with relay.',
                status: 'UNASSIGNED',
              })
            }
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Hardware Kit
          </Button>
        </div>
      </div>

      {/* Fleet KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-white/10 dark:bg-night-raised">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Hardware Kits</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {summary.totalSetups || setups.length}
          </p>
          <span className="text-xs text-slate-400">Registered across system</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-white/10 dark:bg-night-raised">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active In-Field</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {summary.activeSetups || setups.filter((s) => s.status === 'ACTIVE').length}
          </p>
          <span className="text-xs text-slate-400">Deployed to farmers</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-white/10 dark:bg-night-raised">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Available</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">
            {summary.unassignedSetups || unassignedKits.length}
          </p>
          <span className="text-xs text-slate-400">Ready for assignment</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-white/10 dark:bg-night-raised">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            {summary.pendingRequests || pendingRequestsCount}
          </p>
          <span className="text-xs text-slate-400">Farmers awaiting setup</span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-white/10 gap-2">
        <button
          onClick={() => setSubTab('kits')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold transition-all border-b-2 ${
            subTab === 'kits'
              ? 'border-green-600 text-green-700 dark:border-green-400 dark:text-green-300'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Cpu className="h-4 w-4" />
          Hardware Kits &amp; Allocations ({setups.length})
        </button>

        <button
          onClick={() => setSubTab('requests')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold transition-all border-b-2 relative ${
            subTab === 'requests'
              ? 'border-green-600 text-green-700 dark:border-green-400 dark:text-green-300'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" />
          Farmer Setup Requests ({requests.length})
          {pendingRequestsCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white animate-pulse">
              {pendingRequestsCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('devices')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold transition-all border-b-2 ${
            subTab === 'devices'
              ? 'border-green-600 text-green-700 dark:border-green-400 dark:text-green-300'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Sliders className="h-4 w-4" />
          Sensor Probes &amp; Relays ({devices.length})
        </button>
      </div>

      {/* =========================================================
          TAB 1: HARDWARE KITS & ALLOCATIONS
      ========================================================= */}
      {subTab === 'kits' && (
        <Card noPadding className="overflow-hidden">
          {setups.length === 0 ? (
            <EmptyState icon={Cpu} title="No Hardware Kits Found" text="Add your first ESP32 hardware kit using the button above." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/70 text-left text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Hardware Kit Code</th>
                    <th className="px-5 py-3.5">Assigned Farmer</th>
                    <th className="px-5 py-3.5">Farm &amp; Location</th>
                    <th className="px-5 py-3.5">Target Crop</th>
                    <th className="px-5 py-3.5">Telemetry Snapshot</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Allocation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {setups.map((kit) => {
                    const isAssigned = Boolean(kit.userId || kit.userEmail)
                    return (
                      <tr key={kit.id} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <span className={`h-2.5 w-2.5 rounded-full ${kit.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                            <div>
                              <span className="font-mono font-bold text-slate-900 dark:text-white">
                                {kit.setupCode}
                              </span>
                              <p className="text-[11px] text-slate-400">{kit.battery || 'AC Main'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {isAssigned ? (
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                {kit.userName || `User #${kit.userId}`}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{kit.userEmail}</p>
                              {kit.userPhone && (
                                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <Phone className="h-3 w-3" /> {kit.userPhone}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                              Unassigned (In Inventory)
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900 dark:text-white">{kit.farmName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {kit.location || 'Not Specified'}
                          </p>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <Sprout className="h-3 w-3" /> {kit.cropType || 'General'}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          {isAssigned ? (
                            <div className="text-xs space-y-0.5 text-slate-600 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <span>Moisture:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{kit.soilMoisture ?? 50}%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>Temp / Tank:</span>
                                <span>{kit.temperature ?? 26}°C / {kit.waterLevel ?? 80}%</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No live feed</span>
                          )}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <Badge
                            tone={
                              kit.status === 'ACTIVE'
                                ? 'green'
                                : kit.status === 'MAINTENANCE'
                                ? 'amber'
                                : 'slate'
                            }
                          >
                            {kit.status}
                          </Badge>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isAssigned ? (
                              <>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => openAssignModal(kit)}
                                  className="!py-1 !px-2.5 !text-xs"
                                >
                                  Reassign
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => setUnassignModal(kit)}
                                  className="!py-1 !px-2.5 !text-xs"
                                >
                                  Unassign
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => openAssignModal(kit)}
                                className="!py-1 !px-3 !text-xs"
                                leftIcon={<UserCheck className="h-3.5 w-3.5" />}
                              >
                                Assign Farmer
                              </Button>
                            )}

                            {kit.status !== 'MAINTENANCE' ? (
                              <button
                                onClick={() => handleToggleStatus(kit, 'MAINTENANCE')}
                                title="Set Maintenance Mode"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleStatus(kit, 'ACTIVE')}
                                title="Set Active Mode"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              onClick={() => setDeleteModal(kit)}
                              title="Delete Hardware Kit"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* =========================================================
          TAB 2: FARMER SETUP APPLICATIONS
      ========================================================= */}
      {subTab === 'requests' && (
        <Card noPadding className="overflow-hidden">
          {requests.length === 0 ? (
            <EmptyState icon={FileText} title="No Setup Applications" text="When farmers apply for IoT sensor hardware, their applications will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/70 text-left text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Farmer &amp; Contact</th>
                    <th className="px-5 py-3.5">Farm Details</th>
                    <th className="px-5 py-3.5">Crop &amp; Land Size</th>
                    <th className="px-5 py-3.5">Water &amp; Pump Type</th>
                    <th className="px-5 py-3.5">Applied Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {req.userName || `User #${req.userId}`}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{req.userEmail}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" /> {req.phoneNumber || 'No phone'}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900 dark:text-white">{req.farmName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" /> {req.farmLocation || 'Location Pending'}
                        </p>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{req.cropType || 'General'}</p>
                        <span className="text-xs text-slate-400">{req.farmSize || 'N/A'}</span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          <span className="font-semibold">Water:</span> {req.waterSource || 'Tube well'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold">Pump:</span> {req.pumpType || 'Electric Submersible'}
                        </p>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <Badge
                          tone={
                            req.status === 'APPROVED'
                              ? 'green'
                              : req.status === 'REJECTED'
                              ? 'red'
                              : 'amber'
                          }
                        >
                          {req.status}
                        </Badge>
                        {req.assignedSetupCode && (
                          <p className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                            {req.assignedSetupCode}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        {req.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => openApproveModal(req)}
                              className="!py-1 !px-3 !text-xs"
                              leftIcon={<Check className="h-3.5 w-3.5" />}
                            >
                              Approve &amp; Assign Kit
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setRejectModal(req)
                                setRejectNotes('')
                              }}
                              className="!py-1 !px-2.5 !text-xs hover:!text-red-600"
                              leftIcon={<XCircle className="h-3.5 w-3.5" />}
                            >
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Processed</span>
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

      {/* =========================================================
          TAB 3: SENSOR PROBES & CALIBRATION (LEGACY DEVICES)
      ========================================================= */}
      {subTab === 'devices' && (
        <Card noPadding className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Active Sensor Probes Fleet</h3>
              <p className="text-xs text-slate-500">Soil moisture, DHT22, raindrop, water level, and relay switch sensors.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/70 text-left text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Device Code</th>
                  <th className="px-5 py-3">Sensor Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Battery / Power</th>
                  <th className="px-5 py-3">Safe Thresholds</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {devices.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-white/5">
                    <td className="px-5 py-3 font-mono font-bold text-slate-700 dark:text-slate-200">{d.deviceCode}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white">{d.name}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{d.type}</td>
                    <td className="px-5 py-3 text-slate-500">{d.location}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{d.battery}</td>
                    <td className="px-5 py-3 text-xs text-slate-600 dark:text-slate-400">
                      {d.lowThreshold ?? '—'} - {d.highThreshold ?? '—'} {d.unit}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={d.status === 'active' ? 'green' : 'slate'}>{d.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* =========================================================
          MODALS
      ========================================================= */}

      {/* 1. Add Hardware Kit Modal */}
      <Modal open={Boolean(kitModal)} onClose={() => setKitModal(null)} title="Register New Hardware Kit">
        {kitModal && (
          <form onSubmit={handleCreateKit} className="space-y-4 px-5 py-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Hardware Kit Code <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={kitModal.setupCode}
                onChange={(e) => setKitModal({ ...kitModal, setupCode: e.target.value })}
                className="input-field font-mono"
                placeholder="e.g. KIT-ESP32-005"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Default Farm / Storage Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={kitModal.farmName}
                  onChange={(e) => setKitModal({ ...kitModal, farmName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Central Inventory Pool"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Location / City
                </label>
                <input
                  value={kitModal.location || ''}
                  onChange={(e) => setKitModal({ ...kitModal, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Karachi Warehouse"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Power Source
                </label>
                <select
                  value={kitModal.battery}
                  onChange={(e) => setKitModal({ ...kitModal, battery: e.target.value })}
                  className="input-field"
                >
                  <option>AC Main + Solar</option>
                  <option>Solar Powered (12V)</option>
                  <option>Rechargeable Li-Ion (3.7V)</option>
                  <option>Direct AC Adapter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Status
                </label>
                <select
                  value={kitModal.status}
                  onChange={(e) => setKitModal({ ...kitModal, status: e.target.value })}
                  className="input-field"
                >
                  <option value="UNASSIGNED">UNASSIGNED (In Stock)</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Hardware Notes
              </label>
              <textarea
                value={kitModal.notes || ''}
                onChange={(e) => setKitModal({ ...kitModal, notes: e.target.value })}
                rows={2}
                className="input-field resize-none text-xs"
                placeholder="Include sensor types, firmware revision, or calibration offsets."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setKitModal(null)}>Cancel</Button>
              <Button type="submit">Save Hardware Kit</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* 2. Assign / Reassign Farmer Modal */}
      <Modal
        open={Boolean(assignModal)}
        onClose={() => setAssignModal(null)}
        title={`Allocate ${assignModal?.setupCode || 'Kit'} to Farmer`}
      >
        {assignModal && (
          <form onSubmit={handleAssignSubmit} className="space-y-4 px-5 py-5">
            <p className="text-xs text-slate-500">
              Link this IoT hardware kit to a farmer. Telemetry and controls will be exclusively visible on their dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Farmer User ID
                </label>
                <input
                  type="number"
                  value={assignForm.userId}
                  onChange={(e) => setAssignForm({ ...assignForm, userId: e.target.value })}
                  className="input-field"
                  placeholder="e.g. 1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Farmer Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={assignForm.userName}
                  onChange={(e) => setAssignForm({ ...assignForm, userName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Abu Hurera Junejo"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Farmer Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={assignForm.userEmail}
                  onChange={(e) => setAssignForm({ ...assignForm, userEmail: e.target.value })}
                  className="input-field"
                  placeholder="farmer@asankisan.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  value={assignForm.userPhone}
                  onChange={(e) => setAssignForm({ ...assignForm, userPhone: e.target.value })}
                  className="input-field"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Farm Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={assignForm.farmName}
                onChange={(e) => setAssignForm({ ...assignForm, farmName: e.target.value })}
                className="input-field"
                placeholder="e.g. Junejo Model Wheat Farm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Location / District
                </label>
                <input
                  value={assignForm.location}
                  onChange={(e) => setAssignForm({ ...assignForm, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Tando Jam, Sindh"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Crop Type
                </label>
                <select
                  value={assignForm.cropType}
                  onChange={(e) => setAssignForm({ ...assignForm, cropType: e.target.value })}
                  className="input-field"
                >
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Cotton</option>
                  <option>Sugarcane</option>
                  <option>Maize</option>
                  <option>Tomato</option>
                  <option>Vegetables</option>
                  <option>Citrus / Mango Orchards</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setAssignModal(null)}>Cancel</Button>
              <Button type="submit">Confirm Allocation</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* 3. Approve Farmer Request Modal */}
      <Modal
        open={Boolean(approveModal)}
        onClose={() => setApproveModal(null)}
        title="Approve Farmer Setup Application"
      >
        {approveModal && (
          <form onSubmit={handleApproveSubmit} className="space-y-4 px-5 py-5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">
                Farmer: {approveModal.userName} ({approveModal.userEmail})
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Farm: {approveModal.farmName} • {approveModal.farmLocation} • {approveModal.farmSize}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Crop: {approveModal.cropType} | Water: {approveModal.waterSource} | Pump: {approveModal.pumpType}
              </p>
              {approveModal.notes && (
                <p className="text-slate-500 italic mt-1 bg-white dark:bg-white/5 p-2 rounded border border-slate-100 dark:border-white/5">
                  &ldquo;{approveModal.notes}&rdquo;
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Assign Hardware Kit <span className="text-red-500">*</span>
              </label>
              {unassignedKits.length > 0 ? (
                <select
                  required
                  value={approveForm.assignedSetupCode}
                  onChange={(e) => setApproveForm({ ...approveForm, assignedSetupCode: e.target.value })}
                  className="input-field font-mono"
                >
                  <option value="">Select an available inventory kit...</option>
                  {unassignedKits.map((k) => (
                    <option key={k.id} value={k.setupCode}>
                      {k.setupCode} - {k.location || 'Warehouse'} ({k.battery})
                    </option>
                  ))}
                </select>
              ) : (
                <div>
                  <input
                    required
                    value={approveForm.assignedSetupCode}
                    onChange={(e) => setApproveForm({ ...approveForm, assignedSetupCode: e.target.value })}
                    className="input-field font-mono"
                    placeholder="Enter Kit Code (e.g. KIT-ESP32-005)"
                  />
                  <p className="text-[11px] text-amber-600 mt-1">
                    No unassigned kits in inventory. A new kit with this code will be created automatically.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Admin Instructions / Dispatch Note
              </label>
              <textarea
                value={approveForm.adminNotes}
                onChange={(e) => setApproveForm({ ...approveForm, adminNotes: e.target.value })}
                rows={2}
                className="input-field resize-none text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setApproveModal(null)}>Cancel</Button>
              <Button type="submit">Approve &amp; Dispatch Kit</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* 4. Reject Farmer Request Modal */}
      <Modal open={Boolean(rejectModal)} onClose={() => setRejectModal(null)} title="Decline Setup Application">
        {rejectModal && (
          <form onSubmit={handleRejectSubmit} className="space-y-4 px-5 py-5">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Decline IoT setup request for <strong>{rejectModal.farmName}</strong> ({rejectModal.userName}).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Reason for Declining
              </label>
              <textarea
                required
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                rows={3}
                className="input-field resize-none text-xs"
                placeholder="e.g. Location currently out of installation coverage area; please reapply next month."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setRejectModal(null)}>Cancel</Button>
              <Button type="submit" variant="danger">Decline Request</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* 5. Unassign Kit Confirm Modal */}
      <ConfirmModal
        open={Boolean(unassignModal)}
        title="Unassign Hardware Kit"
        message={`Are you sure you want to unassign ${unassignModal?.setupCode}? It will be returned to the inventory pool and removed from the farmer's dashboard.`}
        confirmLabel="Unassign Kit"
        onClose={() => setUnassignModal(null)}
        onConfirm={handleUnassignConfirm}
      />

      {/* 6. Delete Kit Confirm Modal */}
      <ConfirmModal
        open={Boolean(deleteModal)}
        title="Delete Hardware Kit"
        message={`Delete ${deleteModal?.setupCode}? This action removes this hardware record permanently.`}
        confirmLabel="Delete"
        tone="danger"
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteKitConfirm}
      />
    </div>
  )
}
