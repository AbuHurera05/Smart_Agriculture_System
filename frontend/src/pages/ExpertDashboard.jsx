import { useEffect, useState } from 'react'
import {
  GraduationCap, Plus, Edit2, Trash2, Calendar, MapPin, Users,
  X, BarChart3
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import { workshopAPI } from '../services/api'
import { workshopFromResponse, workshopToRequest } from '../utils/workshopMapper'

const emptyForm = {
  title: '', date: '', time: '', venue: '', type: 'online',
  capacity: 50, price: 0, topics: '', description: '', image: '🌱',
}

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback

export default function ExpertDashboard() {
  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // GET /experts/workshops/my -> WorkshopController.getMyWorkshops() (EXPERT/ADMIN)
  const loadMyWorkshops = async () => {
    setLoading(true)
    try {
      const response = await workshopAPI.getMyWorkshops()
      setWorkshops((response.data?.data || []).map(workshopFromResponse))
    } catch (error) {
      console.error('Failed to load your workshops:', error)
      toast.error(getErrorMessage(error, 'Could not load your training sessions'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMyWorkshops()
  }, [])

  const totalEnrolled = workshops.reduce((sum, w) => sum + (w.enrolled || 0), 0)
  const upcomingCount = workshops.filter((w) => w.status === 'upcoming').length

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (workshop) => {
    setEditing(workshop)
    setForm({
      ...workshop,
      topics: (workshop.topics || []).join(', '),
    })
    setShowModal(true)
  }

  // DELETE /experts/workshops/{id} -> WorkshopController.delete() (EXPERT/ADMIN, owner-checked)
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this training session? This cannot be undone.')) return

    try {
      await workshopAPI.delete(id)
      setWorkshops((prev) => prev.filter((w) => w.id !== id))
      toast.success('Training session deleted')
    } catch (error) {
      console.error('Delete workshop error:', error)
      toast.error(getErrorMessage(error, 'Could not delete training session'))
    }
  }

  // POST /experts/workshops or PUT /experts/workshops/{id}
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date || !form.time || !form.venue.trim() || !form.description.trim()) {
      toast.error('Title, date, time, venue and description are required')
      return
    }

    const payload = workshopToRequest(form)
    setSaving(true)

    try {
      if (editing) {
        const response = await workshopAPI.update(editing.id, payload)
        const updated = workshopFromResponse(response.data?.data)
        setWorkshops((prev) => prev.map((w) => (w.id === editing.id ? updated : w)))
        toast.success(response.data?.message || 'Training session updated')
      } else {
        const response = await workshopAPI.create(payload)
        const created = workshopFromResponse(response.data?.data)
        setWorkshops((prev) => [created, ...prev])
        toast.success(response.data?.message || 'Training session created')
      }
      setShowModal(false)
    } catch (error) {
      console.error('Save workshop error:', error)
      toast.error(getErrorMessage(error, 'Could not save training session'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expert Dashboard</h1>
          <p className="text-gray-600 mt-1">Create and manage your training sessions, workshops and courses</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Training Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{workshops.length}</p>
              <p className="text-sm text-gray-500">Sessions Created</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalEnrolled}</p>
              <p className="text-sm text-gray-500">Total Enrollments</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{upcomingCount}</p>
              <p className="text-sm text-gray-500">Upcoming Sessions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* My Workshops */}
      <div>
        <h2 className="text-xl font-bold mb-4">My Training Sessions</h2>
        {workshops.length === 0 ? (
          <Card className="text-center py-12">
            <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">You haven't created any training sessions yet</p>
            <Button variant="primary" className="mt-4" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Session
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workshops.map((workshop) => (
              <Card key={workshop.id} hover>
                <div className="flex gap-4">
                  <div className="text-5xl">{workshop.image || '📘'}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{workshop.title}</h3>
                      <span className={`badge ${workshop.status === 'upcoming' ? 'badge-info' : 'badge-success'} text-xs capitalize`}>
                        {workshop.status}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{workshop.date} · {workshop.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{workshop.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{workshop.enrolled}/{workshop.capacity} enrolled</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(workshop.topics || []).map((topic, idx) => (
                        <span key={idx} className="badge badge-info text-xs">{topic}</span>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(workshop)}>
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(workshop.id)}>
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  {editing ? 'Edit Training Session' : 'New Training Session'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <input type="time" className="input-field" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      <option value="online">Online</option>
                      <option value="in-person">In-person</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input type="number" min="1" className="input-field" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                  <input className="input-field" placeholder="e.g. Online (Zoom) or Community Center, Delhi" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹, 0 for free)</label>
                  <input type="number" min="0" step="0.01" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topics (comma separated)</label>
                  <input className="input-field" placeholder="e.g. Composting, Crop Rotation" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>

                {editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1" loading={saving}>
                    {editing ? 'Save Changes' : 'Create Session'}
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