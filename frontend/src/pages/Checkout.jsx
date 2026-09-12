import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Truck, CreditCard, CheckCircle2, ClipboardCheck, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useStore from '../store/useStore'
import { useAuthContext } from '../context/AuthContext'
import { marketplaceAPI } from '../services/api'
import { cartGroupToOrderRequest } from '../utils/marketplaceMapper'
import { EmptyState } from './Marketplace'

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback

const STEPS = ['Address', 'Delivery', 'Review', 'Confirmation']

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { cartItems, clearCart } = useStore()

  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [placedOrders, setPlacedOrders] = useState(null)
  const [placeError, setPlaceError] = useState(null)

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Pakistan',
  })
  const [deliveryMethod, setDeliveryMethod] = useState('standard') // standard | express | pickup

  const cartTotal = cartItems.reduce((sum, c) => sum + c.price * c.qty, 0)
  const groupedBySeller = Object.entries(
    cartItems.reduce((acc, item) => {
      const key = item.sellerId ?? 'unknown'
      acc[key] = acc[key] || { sellerName: item.sellerName, items: [] }
      acc[key].items.push(item)
      return acc
    }, {})
  )

  if (cartItems.length === 0 && !placedOrders) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Nothing to check out"
        subtitle="Your cart is empty."
        action={<Button variant="primary" className="mt-4" onClick={() => navigate('/marketplace')}>Browse Products</Button>}
      />
    )
  }

  const addressString = `${address.name}, ${address.street}, ${address.city}, ${address.province} ${address.postalCode}, ${address.country} (${address.phone})`

  const validateAddress = () => {
    if (!address.name || !address.phone || !address.street || !address.city) {
      toast.error('Please fill in name, phone, street and city')
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    setPlaceError(null)
    try {
      const results = []
      for (const [sellerIdRaw, group] of groupedBySeller) {
        const sellerId = sellerIdRaw === 'unknown' ? undefined : Number(sellerIdRaw)
        const payload = cartGroupToOrderRequest(sellerId, group.items, addressString, deliveryMethod)
        const res = await marketplaceAPI.createOrder(payload)
        results.push(res.data?.data ?? res.data)
      }
      setPlacedOrders(results)
      clearCart()
      setStep(3)
      toast.success('Order placed successfully!')
    } catch (err) {
      setPlaceError(getErrorMessage(err, 'Could not place your order. Please try again.'))
      toast.error(getErrorMessage(err, 'Could not place your order'))
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {step < 3 && (
        <button onClick={() => navigate('/marketplace/cart')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16} /> Back to Cart
        </button>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${i <= step ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-xs font-medium ${i <= step ? 'text-gray-700' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-3 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <Card>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4"><MapPin size={16} /> Delivery Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full Name" required value={address.name} onChange={(v) => setAddress({ ...address, name: v })} />
            <Field label="Phone" type="tel" required value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
            <Field label="Street Address" required className="sm:col-span-2" value={address.street} onChange={(v) => setAddress({ ...address, street: v })} />
            <Field label="City" required value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
            <Field label="Province" value={address.province} onChange={(v) => setAddress({ ...address, province: v })} />
            <Field label="Postal Code" value={address.postalCode} onChange={(v) => setAddress({ ...address, postalCode: v })} />
            <Field label="Country" required value={address.country} onChange={(v) => setAddress({ ...address, country: v })} />
          </div>
          <Button variant="primary" className="mt-5" onClick={() => validateAddress() && setStep(1)}>Continue to Delivery</Button>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4"><Truck size={16} /> Delivery Method</h2>
          <div className="space-y-2">
            {[
              { id: 'standard', label: 'Standard Delivery', hint: 'Delivered by the seller\u2019s usual courier' },
              { id: 'express', label: 'Express Delivery', hint: 'Faster dispatch where available' },
              { id: 'pickup', label: 'Seller Pickup', hint: 'Collect directly from the seller\u2019s location' },
            ].map((opt) => (
              <label key={opt.id} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer ${deliveryMethod === opt.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                <input type="radio" className="mt-1" checked={deliveryMethod === opt.id} onChange={() => setDeliveryMethod(opt.id)} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.hint}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
            <Button variant="primary" onClick={() => setStep(2)}>Continue to Review</Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4"><ClipboardCheck size={16} /> Review Your Order</h2>

          <div className="text-sm text-gray-600 mb-4">
            <p className="font-medium text-gray-800">Deliver to</p>
            <p>{addressString}</p>
          </div>

          <div className="space-y-4">
            {groupedBySeller.map(([sellerId, group]) => (
              <div key={sellerId} className="border-t pt-3">
                <p className="text-xs font-medium text-gray-500 mb-1">Sold by {group.sellerName || 'Seller'}</p>
                {group.items.map((it) => (
                  <div key={it.productId} className="flex justify-between text-sm py-0.5">
                    <span>{it.qty} {it.unit} × {it.title}</span>
                    <span>₹{(it.price * it.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-gray-800">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 bg-gray-50 rounded-lg p-2.5">
            <CreditCard size={14} /> Payment: Cash on delivery / pay on confirmation with the seller.
          </div>

          {placeError && <p className="text-sm text-danger mt-3">{placeError}</p>}

          <div className="flex gap-3 mt-5">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button variant="primary" loading={placing} onClick={handlePlaceOrder}>Place Order</Button>
          </div>
        </Card>
      )}

      {step === 3 && placedOrders && (
        <Card className="text-center py-10">
          <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Order placed successfully!</h2>
          <p className="text-sm text-gray-500 mt-1">
            {placedOrders.length > 1
              ? `${placedOrders.length} orders were created — one per seller.`
              : 'Your order has been sent to the seller for confirmation.'}
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="secondary" onClick={() => navigate('/marketplace')}>Continue Shopping</Button>
            <Button variant="primary" onClick={() => navigate('/marketplace/orders')}>View My Orders</Button>
          </div>
        </Card>
      )}
    </div>
  )
}

function Field({ label, value, onChange, className = '', type = 'text', required = false }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        className="input-field mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  )
}