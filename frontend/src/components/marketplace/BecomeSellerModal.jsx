import { useState } from 'react'
import { X, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../common/Button'

export default function BecomeSellerModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ shopName: '', description: '', location: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.shopName.trim()) {
      toast.error('Please enter a shop / farm name')
      return
    }
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Store size={20} /></div>
            <h2 className="font-semibold text-lg">Become a Seller</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-gray-500">
            Set up your seller profile to start listing produce, seeds, equipment and more on the
            Smart Agri Marketplace. It only takes a minute.
          </p>

          <div>
            <label className="text-sm font-medium text-gray-700">Shop / Farm Name</label>
            <input
              className="input-field mt-1"
              placeholder="e.g. Green Valley Farms"
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">About your business</label>
            <textarea
              className="input-field mt-1"
              rows={3}
              placeholder="Tell buyers what you grow or sell..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Pickup / Business Location</label>
            <input
              className="input-field mt-1"
              placeholder="e.g. Nashik, Maharashtra"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Not now</Button>
            <Button type="submit" variant="primary">Create Seller Profile</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
