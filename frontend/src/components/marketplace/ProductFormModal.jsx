import { useState } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../common/Button'
import { productCategories, productUnits } from '../../utils/constants'

const emojiByCategory = {
  produce: '🌾',
  seeds: '🌱',
  fertilizers: '🧪',
  equipment: '🚜',
  tools: '🛠️',
  livestock: '🐄',
}

export default function ProductFormModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || productCategories[0].id,
    price: initialData?.price || '',
    unit: initialData?.unit || productUnits[0],
    stock: initialData?.stock || '',
    organic: initialData?.organic || false,
    negotiable: initialData?.negotiable || false,
  })

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.price || !form.stock) {
      toast.error('Please fill in title, price and available stock')
      return
    }
    onSave({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image: emojiByCategory[form.category] || '📦',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">
            {initialData ? 'Edit Listing' : 'List a New Product'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Product Title</label>
            <input
              className="input-field mt-1"
              placeholder="e.g. Fresh Organic Tomatoes"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="input-field mt-1"
              rows={3}
              placeholder="Describe quality, harvest date, delivery options..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              className="input-field mt-1"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {productCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                min="0"
                className="input-field mt-1"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Unit</label>
              <select
                className="input-field mt-1"
                value={form.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
              >
                {productUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                min="0"
                className="input-field mt-1"
                value={form.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.organic}
                onChange={(e) => handleChange('organic', e.target.checked)}
              />
              Organic / Certified
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.negotiable}
                onChange={(e) => handleChange('negotiable', e.target.checked)}
              />
              Price negotiable
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">
              {initialData ? 'Save Changes' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
