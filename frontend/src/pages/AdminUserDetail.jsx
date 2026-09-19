import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, BadgeCheck,
  Map, Wifi, Sprout, Activity, Battery, GraduationCap
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useAuthContext } from '../context/AuthContext'
import { generateUserFarmData } from '../utils/mockUserData'

// Backend's UserResponse.userType is the business role: ADMIN / FARMER / EXPERT.
const userTypeBadge = {
  admin: 'badge-danger',
  expert: 'badge-info',
  farmer: 'badge-success',
}

export default function AdminUserDetail() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { users, fetchUsers, adminUpdateUser } = useAuthContext()

  // This page can be opened directly via URL (not just navigated to from
  // AdminPanel), so make sure `users` is actually loaded rather than
  // assuming AdminPanel's fetch already ran.
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const targetUser = users.find((u) => String(u.id) === String(userId))

  // Grant/revoke expert access by updating userType via PUT /admin/users/{id}.
  const handleToggleExpertAccess = async () => {
    const isExpert = (targetUser.userType || '').toUpperCase() === 'EXPERT'
    const nextUserType = isExpert ? 'FARMER' : 'EXPERT'

    const confirmed = window.confirm(
      isExpert
        ? `Revoke expert access for ${targetUser.name}? They will become a farmer.`
        : `Grant expert access to ${targetUser.name}?`
    )
    if (!confirmed) return

    await adminUpdateUser(targetUser.id, {
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      userType: nextUserType,
      phone: targetUser.phone,
      location: targetUser.location,
    })
  }

  // No backend endpoint yet returns a farmer's fields/sensors/crops/activity
  // feed, so this stays mocked until one exists.
  const farmData = useMemo(() => generateUserFarmData(userId), [userId])

  if (!targetUser) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => navigate('/admin')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admin Panel
        </Button>
        <Card className="text-center py-12">
          <p className="text-gray-500">User not found.</p>
        </Card>
      </div>
    )
  }

  const userType = (targetUser.userType || '').toLowerCase()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="secondary" onClick={() => navigate('/admin')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admin Panel
        </Button>
      </div>

      {/* Profile summary */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-3xl">
              <span>{targetUser.avatar || '🧑‍🌾'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{targetUser.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {targetUser.email}</span>
                {targetUser.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {targetUser.phone}</span>}
                {targetUser.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {targetUser.location}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`badge ${userTypeBadge[userType] || 'badge-info'} inline-flex items-center gap-1 capitalize`}>
              <BadgeCheck size={12} /> {targetUser.userType || 'Unknown'}
            </span>
            <span className="text-xs text-gray-400">Security role: {targetUser.role || '—'}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Joined {targetUser.joinDate ? new Date(targetUser.joinDate).toLocaleDateString() : '—'}
            </span>
            {userType !== 'admin' && (
              <Button
                variant={userType === 'expert' ? 'danger' : 'secondary'}
                size="sm"
                onClick={handleToggleExpertAccess}
              >
                <GraduationCap className="w-4 h-4 mr-1" />
                {userType === 'expert' ? 'Revoke Expert Access' : 'Grant Expert Access'}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-sm">
          <div className="p-3 rounded-xl bg-gray-50">
            <p className="text-gray-400 text-xs">Farm Size</p>
            <p className="font-medium">{targetUser.farmSize || '—'}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50">
            <p className="text-gray-400 text-xs">Specialization</p>
            <p className="font-medium">{targetUser.specialization || '—'}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50">
            <p className="text-gray-400 text-xs">Experience</p>
            <p className="font-medium">{targetUser.experience || '—'}</p>
          </div>
        </div>
      </Card>

      {/* Fields */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Map className="w-5 h-5 text-primary" /> Fields ({farmData.fields.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {farmData.fields.map((field) => (
            <Card key={field.id}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{field.name}</h3>
                <span className={`badge ${field.status === 'active' ? 'badge-success' : 'badge-warning'} text-xs capitalize`}>{field.status}</span>
              </div>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>Size: {field.size} {field.unit}</p>
                <p>Crop: {field.crop}</p>
                <p>Soil: {field.soilType}</p>
                <p>Soil Health: {field.soilHealth}% · Moisture: {field.moisture}%</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sensors */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Wifi className="w-5 h-5 text-primary" /> Sensors ({farmData.sensors.length})</h2>
        <Card className="overflow-hidden" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Battery</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {farmData.sensors.map((sensor) => (
                  <tr key={sensor.id}>
                    <td className="px-4 py-2 text-sm">{sensor.name}</td>
                    <td className="px-4 py-2 text-sm">{sensor.type}</td>
                    <td className="px-4 py-2 text-sm">{sensor.location}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`badge ${sensor.status === 'active' ? 'badge-success' : 'badge-warning'} text-xs capitalize`}>{sensor.status}</span>
                    </td>
                    <td className="px-4 py-2 text-sm flex items-center gap-1"><Battery className="w-3.5 h-3.5" /> {sensor.battery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Crops */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Sprout className="w-5 h-5 text-primary" /> Crops ({farmData.crops.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {farmData.crops.map((crop) => (
            <Card key={crop.id}>
              <h3 className="font-semibold">{crop.name}</h3>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>Season: {crop.season}</p>
                <p>Planted: {crop.plantedOn}</p>
                <p>Expected Yield: {crop.expectedYield}</p>
                <p>Status: {crop.status}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Recent Activity</h2>
        <Card>
          <div className="space-y-3">
            {farmData.activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0">
                <span>{activity.description}</span>
                <span className="text-gray-400">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}