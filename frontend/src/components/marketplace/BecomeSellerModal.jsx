// import { useState } from 'react'
// import { X, Store } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Button from '../common/Button'

// export default function BecomeSellerModal({ onClose, onSubmit }) {
//   const [form, setForm] = useState({ shopName: '', description: '', location: '' })
//   const [submitting, setSubmitting] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!form.shopName.trim()) {
//       toast.error('Please enter a shop / farm name')
//       return
//     }
//     if (!form.location.trim()) {
//       toast.error('Please enter your pickup / business location')
//       return
//     }

//     setSubmitting(true)
//     try {
//       await onSubmit(form)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//         <div className="flex items-center justify-between p-4 border-b">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-primary/10 rounded-lg text-primary"><Store size={20} /></div>
//             <h2 className="font-semibold text-lg">Become a Seller</h2>
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
//           <p className="text-sm text-gray-500">
//             Set up your seller profile to start listing produce, seeds, equipment and more on the
//             Smart Agri Marketplace. It only takes a minute.
//           </p>

//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Shop / Farm Name <span className="text-danger">*</span>
//             </label>
//             <input
//               className="input-field mt-1"
//               placeholder="e.g. Green Valley Farms"
//               value={form.shopName}
//               onChange={(e) => setForm({ ...form, shopName: e.target.value })}
//               disabled={submitting}
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700">About your business</label>
//             <textarea
//               className="input-field mt-1"
//               rows={3}
//               maxLength={500}
//               placeholder="Tell buyers what you grow or sell..."
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               disabled={submitting}
//             />
//             <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Pickup / Business Location <span className="text-danger">*</span>
//             </label>
//             <input
//               className="input-field mt-1"
//               placeholder="e.g. Nashik, Maharashtra"
//               value={form.location}
//               onChange={(e) => setForm({ ...form, location: e.target.value })}
//               disabled={submitting}
//               required
//             />
//           </div>

//           <div className="flex justify-end gap-3 pt-2">
//             <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
//               Not now
//             </Button>
//             <Button type="submit" variant="primary" loading={submitting}>
//               Create Seller Profile
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

import { useState } from 'react'
import { X, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../common/Button'

export default function BecomeSellerModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    shopName: '',
    description: '',
    storeLogoUrl: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    location: '',
    sellerType: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Required: shop name
    if (!form.shopName.trim()) {
      toast.error('Please enter a shop / farm name')
      return
    }

    // Required: seller type
    if (!form.sellerType) {
      toast.error('Please select your seller type')
      return
    }

    // Location is useful for marketplace, but backend considers it optional
    if (!form.location.trim()) {
      toast.error('Please enter your pickup / business location')
      return
    }

    setSubmitting(true)

    try {
      await onSubmit({
        ...form,
        shopName: form.shopName.trim(),
        description: form.description.trim(),
        storeLogoUrl: form.storeLogoUrl.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        location: form.location.trim(),
        sellerType: form.sellerType,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Store size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-lg">
                Become a Seller
              </h2>
              <p className="text-xs text-gray-500">
                Create your marketplace seller profile
              </p>
            </div>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">

          <p className="text-sm text-gray-500">
            Set up your seller profile to start listing produce, seeds,
            equipment and other agricultural products on the Smart Agri
            Marketplace.
          </p>

          {/* Shop Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Shop / Farm Name <span className="text-danger">*</span>
            </label>

            <input
              type="text"
              className="input-field mt-1 w-full"
              placeholder="e.g. Green Valley Farms"
              value={form.shopName}
              onChange={(e) => handleChange('shopName', e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          {/* Seller Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Seller Type <span className="text-danger">*</span>
            </label>

            <select
              className="input-field mt-1 w-full"
              value={form.sellerType}
              onChange={(e) => handleChange('sellerType', e.target.value)}
              disabled={submitting}
              required
            >
              <option value="">Select seller type</option>
              <option value="INDIVIDUAL_FARMER">
                Individual Farmer
              </option>
              <option value="AGRICULTURAL_BUSINESS">
                Agricultural Business
              </option>
              <option value="MANUFACTURER">
                Manufacturer
              </option>
              <option value="DISTRIBUTOR">
                Distributor
              </option>
              <option value="RETAILER">
                Retailer
              </option>
              <option value="WHOLESALER">
                Wholesaler
              </option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              About your business
            </label>

            <textarea
              className="input-field mt-1 w-full"
              rows={3}
              maxLength={500}
              placeholder="Tell buyers what you grow or sell..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={submitting}
            />

            <p className="text-xs text-gray-400 mt-1 text-right">
              {form.description.length}/500
            </p>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                type="tel"
                className="input-field mt-1 w-full"
                placeholder="03XXXXXXXXX"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                className="input-field mt-1 w-full"
                placeholder="seller@example.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={submitting}
              />
            </div>

          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Business / Pickup Address
            </label>

            <input
              type="text"
              className="input-field mt-1 w-full"
              placeholder="Street, area, landmark..."
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={submitting}
            />
          </div>

          {/* City + Province */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium text-gray-700">
                City
              </label>

              <input
                type="text"
                className="input-field mt-1 w-full"
                placeholder="e.g. Karachi"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Province
              </label>

              <input
                type="text"
                className="input-field mt-1 w-full"
                placeholder="e.g. Sindh"
                value={form.province}
                onChange={(e) => handleChange('province', e.target.value)}
                disabled={submitting}
              />
            </div>

          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Pickup / Business Location{' '}
              <span className="text-danger">*</span>
            </label>

            <input
              type="text"
              className="input-field mt-1 w-full"
              placeholder="e.g. Karachi, Sindh"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={submitting}
              required
            />

            <p className="text-xs text-gray-400 mt-1">
              Buyers may see this location when viewing your seller profile.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t">

            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Not now
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={submitting}
            >
              Create Seller Profile
            </Button>

          </div>

        </form>
      </div>
    </div>
  )
}

