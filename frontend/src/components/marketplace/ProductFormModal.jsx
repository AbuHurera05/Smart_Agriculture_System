// import { useState } from 'react'
// import { X, Package } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Button from '../common/Button'
// import { productCategories, productUnits } from '../../utils/constants'

// export default function ProductFormModal({ initialData, onClose, onSave }) {
//   const [form, setForm] = useState({
//     title: initialData?.title || '',
//     description: initialData?.description || '',
//     category: initialData?.category || productCategories[0].id,
//     price: initialData?.price ?? '',
//     originalPrice: initialData?.originalPrice ?? '',
//     unit: initialData?.unit || productUnits[0],
//     stock: initialData?.stock ?? '',
//     imageUrl: initialData?.imageUrl || '',
//     organic: initialData?.organic || false,
//     negotiable: initialData?.negotiable || false,
//   })
//   const [submitting, setSubmitting] = useState(false)

//   const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!form.title.trim()) {
//       toast.error('Please enter a product title')
//       return
//     }
//     if (form.price === '' || Number(form.price) <= 0) {
//       toast.error('Please enter a valid price')
//       return
//     }
//     if (form.stock === '' || Number(form.stock) < 0) {
//       toast.error('Please enter the available stock')
//       return
//     }
//     if (form.originalPrice !== '' && Number(form.originalPrice) <= Number(form.price)) {
//       toast.error('Original price should be higher than the current price')
//       return
//     }

//     setSubmitting(true)
//     try {
//       await onSave(form)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-primary/10 rounded-lg text-primary"><Package size={20} /></div>
//             <h2 className="font-semibold text-lg">
//               {initialData ? 'Edit Listing' : 'List a New Product'}
//             </h2>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={submitting}
//             className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 space-y-4">
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Product Title <span className="text-danger">*</span>
//             </label>
//             <input
//               className="input-field mt-1"
//               placeholder="e.g. Fresh Organic Tomatoes"
//               value={form.title}
//               onChange={(e) => handleChange('title', e.target.value)}
//               disabled={submitting}
//               maxLength={100}
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700">Description</label>
//             <textarea
//               className="input-field mt-1"
//               rows={3}
//               maxLength={500}
//               placeholder="Describe quality, harvest date, delivery options..."
//               value={form.description}
//               onChange={(e) => handleChange('description', e.target.value)}
//               disabled={submitting}
//             />
//             <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700">Category</label>
//             <select
//               className="input-field mt-1"
//               value={form.category}
//               onChange={(e) => handleChange('category', e.target.value)}
//               disabled={submitting}
//             >
//               {productCategories.map((c) => (
//                 <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
//               ))}
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Price (Rs. ) <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 className="input-field mt-1"
//                 value={form.price}
//                 onChange={(e) => handleChange('price', e.target.value)}
//                 disabled={submitting}
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">Original Price (Rs. )</label>
//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 className="input-field mt-1"
//                 placeholder="Optional - shows a discount"
//                 value={form.originalPrice}
//                 onChange={(e) => handleChange('originalPrice', e.target.value)}
//                 disabled={submitting}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="text-sm font-medium text-gray-700">Unit</label>
//               <select
//                 className="input-field mt-1"
//                 value={form.unit}
//                 onChange={(e) => handleChange('unit', e.target.value)}
//                 disabled={submitting}
//               >
//                 {productUnits.map((u) => <option key={u} value={u}>{u}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Stock <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 className="input-field mt-1"
//                 value={form.stock}
//                 onChange={(e) => handleChange('stock', e.target.value)}
//                 disabled={submitting}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700">Image URL</label>
//             <input
//               type="url"
//               className="input-field mt-1"
//               placeholder="https://... (optional)"
//               value={form.imageUrl}
//               onChange={(e) => handleChange('imageUrl', e.target.value)}
//               disabled={submitting}
//             />
//           </div>

//           <div className="flex items-center gap-6">
//             <label className="flex items-center gap-2 text-sm text-gray-700">
//               <input
//                 type="checkbox"
//                 checked={form.organic}
//                 onChange={(e) => handleChange('organic', e.target.checked)}
//                 disabled={submitting}
//               />
//               Organic / Certified
//             </label>
//             <label className="flex items-center gap-2 text-sm text-gray-700">
//               <input
//                 type="checkbox"
//                 checked={form.negotiable}
//                 onChange={(e) => handleChange('negotiable', e.target.checked)}
//                 disabled={submitting}
//               />
//               Price negotiable
//             </label>
//           </div>

//           <div className="flex justify-end gap-3 pt-2">
//             <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
//               Cancel
//             </Button>
//             <Button type="submit" variant="primary" loading={submitting}>
//               {initialData ? 'Save Changes' : 'Publish Listing'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

import { useState } from 'react'
import { X, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../common/Button'
import ImageUploader from '../common/ImageUploader'
import { productCategories, productUnits, productConditions } from '../../utils/constants'

export default function ProductFormModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || productCategories[0].id,
    price: initialData?.price ?? '',
    originalPrice: initialData?.originalPrice ?? '',
    unit: initialData?.unit || productUnits[0],
    stock: initialData?.stock ?? '',
    condition: initialData?.condition || 'NEW',
    imageUrl: initialData?.imageUrl || '',
    // Gallery images beyond the cover photo.
    images: Array.isArray(initialData?.images)
      ? initialData.images.filter((img) => img && img !== initialData?.imageUrl)
      : [],
    city: initialData?.city || '',
    province: initialData?.province || '',
    organic: initialData?.organic || false,
    negotiable: initialData?.negotiable || false,
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) {
      toast.error('Please enter a product title')
      return
    }
    if (form.price === '' || Number(form.price) <= 0) {
      toast.error('Please enter a valid price')
      return
    }
    if (form.stock === '' || Number(form.stock) < 0) {
      toast.error('Please enter the available stock')
      return
    }
    if (form.originalPrice !== '' && Number(form.originalPrice) <= Number(form.price)) {
      toast.error('Original price should be higher than the current price')
      return
    }

    setSubmitting(true)
    try {
      await onSave(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Package size={20} /></div>
            <h2 className="font-semibold text-lg">
              {initialData ? 'Edit Listing' : 'List a New Product'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Title <span className="text-danger">*</span>
            </label>
            <input
              className="input-field mt-1"
              placeholder="e.g. Fresh Organic Tomatoes"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={submitting}
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="input-field mt-1"
              rows={3}
              maxLength={500}
              placeholder="Describe quality, harvest date, delivery options..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={submitting}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              className="input-field mt-1"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              disabled={submitting}
            >
              {productCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Price (Rs. ) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field mt-1"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                disabled={submitting}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Original Price (Rs. )</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field mt-1"
                placeholder="Optional - shows a discount"
                value={form.originalPrice}
                onChange={(e) => handleChange('originalPrice', e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Unit</label>
              <select
                className="input-field mt-1"
                value={form.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                disabled={submitting}
              >
                {productUnits.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Stock <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="input-field mt-1"
                value={form.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Condition</label>
              <select
                className="input-field mt-1"
                value={form.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
                disabled={submitting}
              >
                {productConditions.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0) + c.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                className="input-field mt-1"
                placeholder="e.g. Karachi"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Cover photo — uploaded straight to the server, no external URL needed */}
          <ImageUploader
            label="Cover Photo"
            folder="products"
            value={form.imageUrl}
            onChange={(url) => handleChange('imageUrl', url)}
            disabled={submitting}
          />

          {/* Extra gallery photos */}
          <ImageUploader
            label="More Photos (optional)"
            folder="products"
            multiple
            max={6}
            value={form.images}
            onChange={(urls) => handleChange('images', urls)}
            disabled={submitting}
          />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.organic}
                onChange={(e) => handleChange('organic', e.target.checked)}
                disabled={submitting}
              />
              Organic / Certified
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.negotiable}
                onChange={(e) => handleChange('negotiable', e.target.checked)}
                disabled={submitting}
              />
              Price negotiable
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {initialData ? 'Save Changes' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
