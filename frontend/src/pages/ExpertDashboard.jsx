import { useState } from 'react'
import {
  GraduationCap, Plus, Edit2, Trash2, Calendar, MapPin, Users,
  X, Video, UserPlus, BarChart3
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useDataStore from '../store/useDataStore'
import { useAuthContext } from '../context/AuthContext'

const emptyForm = {
  title: '', date: '', time: '', venue: '', type: 'online',
  capacity: 50, price: 'Free', topics: '', description: '', image: '🌱',
}

export default function ExpertDashboard() {
  const { user } = useAuthContext()
  const { workshops, addWorkshop, updateWorkshop, deleteWorkshop } = useDataStore()

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const myWorkshops = workshops.filter((w) => w.instructorId === user?.id)
  const totalEnrolled = myWorkshops.reduce((sum, w) => sum + (w.enrolled || 0), 0)
  const upcomingCount = myWorkshops.filter((w) => w.status === 'upcoming').length

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

  const handleDelete = (id) => {
    if (window.confirm('Delete this training session? This cannot be undone.')) {
      deleteWorkshop(id)
      toast.success('Training session deleted')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date) {
      toast.error('Title and date are required')
      return
    }

    const payload = {
      ...form,
      capacity: Number(form.capacity) || 0,
      topics: form.topics.split(',').map((t) => t.trim()).filter(Boolean),
      instructor: user?.name,
      instructorId: user?.id,
    }

    if (editing) {
      updateWorkshop(editing.id, payload)
      toast.success('Training session updated')
    } else {
      addWorkshop(payload)
      toast.success('Training session created')
    }
    setShowModal(false)
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
              <p className="text-2xl font-bold">{myWorkshops.length}</p>
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
        {myWorkshops.length === 0 ? (
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
            {myWorkshops.map((workshop) => (
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input className="input-field" placeholder="e.g. 10:00 AM - 1:00 PM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      <option value="online">Online</option>
                      <option value="in-person">In-person</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input type="number" min="1" className="input-field" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input className="input-field" placeholder="e.g. Online (Zoom) or Community Center, Delhi" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input className="input-field" placeholder="e.g. Free or ₹499" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topics (comma separated)</label>
                  <input className="input-field" placeholder="e.g. Composting, Crop Rotation" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                {editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
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
