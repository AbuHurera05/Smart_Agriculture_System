// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   ChevronLeft, MapPin, CreditCard, ClipboardCheck, ShoppingCart, Store, Loader2,
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Card from '../components/common/Card'
// import Button from '../components/common/Button'
// import useStore from '../store/useStore'
// import { useAuthContext } from '../context/AuthContext'
// import { marketplaceAPI } from '../services/api'
// import { cartGroupToOrderRequest, sellerPaymentDetails } from '../utils/marketplaceMapper'
// import { paymentMethods } from '../utils/constants'
// import { formatPKR } from '../utils/format'
// import { getApiErrorMessage } from '../utils/apiError'
// import { EmptyState } from './Marketplace'

// const STEPS = ['Delivery', 'Payment', 'Review']

// export default function Checkout() {
//   const navigate = useNavigate()
//   const { user } = useAuthContext()
//   const { cartItems, removeFromCart } = useStore()

//   const [step, setStep] = useState(0)
//   const [placing, setPlacing] = useState(false)
//   const [placeError, setPlaceError] = useState(null)

//   const [paymentMethod, setPaymentMethod] = useState('COD')
//   const [sellerPayments, setSellerPayments] = useState({}) // sellerId -> details
//   const [loadingPayments, setLoadingPayments] = useState(false)

//   // Pre-fill from the logged-in SmartAgri account; everything stays editable.
//   const [buyer, setBuyer] = useState({
//     name: user?.name || user?.fullName || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     address: user?.address || '',
//     city: user?.city || user?.location || '',
//     province: user?.province || '',
//   })

//   useEffect(() => {
//     setBuyer((prev) => ({
//       name: prev.name || user?.name || user?.fullName || '',
//       email: prev.email || user?.email || '',
//       phone: prev.phone || user?.phone || '',
//       address: prev.address || user?.address || '',
//       city: prev.city || user?.city || user?.location || '',
//       province: prev.province || user?.province || '',
//     }))
//   }, [user])

//   const subtotal = cartItems.reduce((sum, c) => sum + c.price * c.qty, 0)
//   const delivery = 0
//   const grandTotal = subtotal + delivery
//   const itemCount = cartItems.reduce((s, i) => s + i.qty, 0)

//   const groupedBySeller = useMemo(
//     () =>
//       Object.entries(
//         cartItems.reduce((acc, item) => {
//           const key = item.sellerId ?? 'unknown'
//           acc[key] = acc[key] || { sellerName: item.sellerName, items: [] }
//           acc[key].items.push(item)
//           return acc
//         }, {})
//       ),
//     [cartItems]
//   )

//   const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod)

//   // For manual transfer methods, surface whatever payment details the seller
//   // profile already exposes. Nothing is collected from the buyer.
//   useEffect(() => {
//     if (!selectedMethod?.manual) return

//     const sellerIds = groupedBySeller
//       .map(([id]) => id)
//       .filter((id) => id !== 'unknown' && sellerPayments[id] === undefined)

//     if (!sellerIds.length) return

//     let cancelled = false
//     setLoadingPayments(true)

//     Promise.all(
//       sellerIds.map(async (id) => {
//         try {
//           const res = await marketplaceAPI.getSellerProfile(id)
//           return [id, sellerPaymentDetails(res.data?.data ?? res.data)]
//         } catch {
//           return [id, null]
//         }
//       })
//     ).then((entries) => {
//       if (cancelled) return
//       setSellerPayments((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
//       setLoadingPayments(false)
//     })

//     return () => {
//       cancelled = true
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [paymentMethod, groupedBySeller])

//   if (!user) {
//     return (
//       <EmptyState
//         icon={ShoppingCart}
//         title="Please login to continue."
//         subtitle="You need to be signed in before placing an order."
//         action={
//           <Button variant="primary" className="mt-4" onClick={() => navigate('/login')}>
//             Login
//           </Button>
//         }
//       />
//     )
//   }

//   if (cartItems.length === 0) {
//     return (
//       <EmptyState
//         icon={ShoppingCart}
//         title="Nothing to check out"
//         subtitle="Your cart is empty."
//         action={
//           <Button variant="primary" className="mt-4" onClick={() => navigate('/marketplace')}>
//             Browse Products
//           </Button>
//         }
//       />
//     )
//   }

//   const deliveryAddress = [buyer.address, buyer.city, buyer.province]
//     .filter(Boolean)
//     .join(', ')

//   const validateBuyer = () => {
//     const missing =
//       (!buyer.name.trim() && 'your full name') ||
//       (!buyer.phone.trim() && 'a contact phone number') ||
//       (!buyer.address.trim() && 'a delivery address') ||
//       (!buyer.city.trim() && 'your city')

//     if (missing) {
//       toast.error(`Please enter ${missing}`)
//       return false
//     }

//     return true
//   }

//   const handlePlaceOrder = async () => {
//     setPlacing(true)
//     setPlaceError(null)

//     try {
//       const created = []

//       // One order per seller — the existing backend contract.
//       for (const [sellerIdRaw, group] of groupedBySeller) {
//         const sellerId = sellerIdRaw === 'unknown' ? undefined : Number(sellerIdRaw)

//         // NOTE: only productId + quantity are sent. The price/total is never
//         // trusted from the frontend — the backend calculates it.
//         const payload = cartGroupToOrderRequest(sellerId, group.items, {
//           deliveryAddress,
//           city: buyer.city,
//           province: buyer.province,
//           phone: buyer.phone,
//           paymentMethod,
//         })

//         const res = await marketplaceAPI.createOrder(payload)
//         const order = res.data?.data ?? res.data

//         created.push(order)

//         // Only clear what was actually ordered.
//         group.items.forEach((it) => removeFromCart(it.productId))
//       }

//       const first = created[0]

//       toast.success(
//         created.length > 1
//           ? `${created.length} orders placed successfully!`
//           : 'Order placed successfully!'
//       )

//       if (first?.id) {
//         navigate(`/marketplace/orders/${first.id}`)
//       } else {
//         navigate('/marketplace/orders')
//       }
//     } catch (err) {
//       const message = getApiErrorMessage(err, {
//         401: 'Please login to continue.',
//         403: "You don't have permission to perform this action.",
//         404: 'Product not found.',
//         409: 'One of these products is no longer available in the requested quantity.',
//       })

//       setPlaceError(message)
//       toast.error(message)
//     } finally {
//       setPlacing(false)
//     }
//   }

//   return (
//     <div className="max-w-5xl mx-auto space-y-6">
//       <button
//         onClick={() => navigate('/marketplace/cart')}
//         className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
//       >
//         <ChevronLeft size={16} /> Back to Cart
//       </button>

//       {/* Step indicator */}
//       <div className="flex items-center gap-2">
//         {STEPS.map((s, i) => (
//           <div key={s} className="flex items-center flex-1 last:flex-none">
//             <div
//               className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
//                 i <= step ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
//               }`}
//             >
//               {i + 1}
//             </div>
//             <span
//               className={`ml-2 text-xs font-medium ${i <= step ? 'text-gray-700' : 'text-gray-400'}`}
//             >
//               {s}
//             </span>
//             {i < STEPS.length - 1 && (
//               <div className={`h-0.5 flex-1 mx-3 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         {/* ---------------- Left column: the steps ---------------- */}
//         <div className="lg:col-span-2 space-y-5">
//           {step === 0 && (
//             <Card>
//               <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
//                 <MapPin size={16} /> Delivery Information
//               </h2>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <Field
//                   label="Full Name"
//                   required
//                   value={buyer.name}
//                   onChange={(v) => setBuyer({ ...buyer, name: v })}
//                 />
//                 <Field
//                   label="Email"
//                   type="email"
//                   value={buyer.email}
//                   onChange={(v) => setBuyer({ ...buyer, email: v })}
//                 />
//                 <Field
//                   label="Phone"
//                   type="tel"
//                   required
//                   value={buyer.phone}
//                   onChange={(v) => setBuyer({ ...buyer, phone: v })}
//                 />
//                 <Field
//                   label="City"
//                   required
//                   value={buyer.city}
//                   onChange={(v) => setBuyer({ ...buyer, city: v })}
//                 />
//                 <Field
//                   label="Province"
//                   value={buyer.province}
//                   onChange={(v) => setBuyer({ ...buyer, province: v })}
//                 />
//                 <Field
//                   label="Delivery Address"
//                   required
//                   className="sm:col-span-2"
//                   value={buyer.address}
//                   onChange={(v) => setBuyer({ ...buyer, address: v })}
//                 />
//               </div>

//               <Button
//                 variant="primary"
//                 className="mt-5"
//                 onClick={() => validateBuyer() && setStep(1)}
//               >
//                 Continue to Payment
//               </Button>
//             </Card>
//           )}

//           {step === 1 && (
//             <Card>
//               <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
//                 <CreditCard size={16} /> Payment Method
//               </h2>

//               <div className="space-y-2">
//                 {paymentMethods.map((opt) => (
//                   <label
//                     key={opt.id}
//                     className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
//                       paymentMethod === opt.id
//                         ? 'border-primary bg-primary/5'
//                         : 'border-gray-200 hover:border-primary/40'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       className="mt-1"
//                       checked={paymentMethod === opt.id}
//                       onChange={() => setPaymentMethod(opt.id)}
//                     />
//                     <div>
//                       <p className="text-sm font-medium text-gray-800">
//                         <span className="mr-1.5">{opt.icon}</span>
//                         {opt.name}
//                       </p>
//                       <p className="text-xs text-gray-500">{opt.hint}</p>
//                     </div>
//                   </label>
//                 ))}
//               </div>

//               {selectedMethod?.manual && (
//                 <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3.5">
//                   <p className="text-xs font-semibold text-gray-700 mb-2">
//                     Seller payment details
//                   </p>

//                   {loadingPayments ? (
//                     <p className="text-xs text-gray-500 flex items-center gap-1.5">
//                       <Loader2 size={13} className="animate-spin" /> Loading seller details…
//                     </p>
//                   ) : (
//                     groupedBySeller.map(([sellerId, group]) => {
//                       const details = sellerPayments[sellerId]

//                       return (
//                         <div key={sellerId} className="text-xs text-gray-600 mb-2 last:mb-0">
//                           <p className="font-medium text-gray-700 flex items-center gap-1">
//                             <Store size={11} /> {group.sellerName || 'Seller'}
//                           </p>

//                           {!details ? (
//                             <p className="text-gray-400">
//                               This seller hasn&apos;t published payment details yet — they&apos;ll
//                               share them after confirming your order.
//                             </p>
//                           ) : (
//                             <ul className="mt-0.5 space-y-0.5">
//                               {paymentMethod === 'EASYPAISA' && details.easypaisa && (
//                                 <li>EasyPaisa: {details.easypaisa}</li>
//                               )}
//                               {paymentMethod === 'JAZZCASH' && details.jazzcash && (
//                                 <li>JazzCash: {details.jazzcash}</li>
//                               )}
//                               {paymentMethod === 'BANK_TRANSFER' && (
//                                 <>
//                                   {details.bankName && <li>Bank: {details.bankName}</li>}
//                                   {details.accountTitle && (
//                                     <li>Account title: {details.accountTitle}</li>
//                                   )}
//                                   {details.accountNumber && (
//                                     <li>Account / IBAN: {details.accountNumber}</li>
//                                   )}
//                                 </>
//                               )}
//                             </ul>
//                           )}
//                         </div>
//                       )
//                     })
//                   )}

//                   <p className="text-[11px] text-gray-400 mt-2">
//                     Transfer the amount after the order is confirmed and keep your receipt. No card
//                     details are collected by SmartAgri.
//                   </p>
//                 </div>
//               )}

//               <div className="flex gap-3 mt-5">
//                 <Button variant="secondary" onClick={() => setStep(0)}>
//                   Back
//                 </Button>
//                 <Button variant="primary" onClick={() => setStep(2)}>
//                   Continue to Review
//                 </Button>
//               </div>
//             </Card>
//           )}

//           {step === 2 && (
//             <Card>
//               <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
//                 <ClipboardCheck size={16} /> Review Your Order
//               </h2>

//               <div className="text-sm text-gray-600 mb-4">
//                 <p className="font-medium text-gray-800">Deliver to</p>
//                 <p>{buyer.name} · {buyer.phone}</p>
//                 <p>{deliveryAddress}</p>
//                 <p className="mt-2 font-medium text-gray-800">Payment</p>
//                 <p>{selectedMethod?.name}</p>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="text-left text-xs text-gray-400 border-b">
//                       <th className="py-2">Product</th>
//                       <th className="py-2 text-center">Qty</th>
//                       <th className="py-2 text-right">Price</th>
//                       <th className="py-2 text-right">Subtotal</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {groupedBySeller.map(([sellerId, group]) => (
//                       <tr key={sellerId} className="align-top">
//                         <td colSpan={4} className="pt-3">
//                           <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                             <Store size={11} /> {group.sellerName || 'Seller'}
//                           </p>
//                           <table className="w-full">
//                             <tbody>
//                               {group.items.map((it) => (
//                                 <tr key={it.productId} className="border-b last:border-0">
//                                   <td className="py-1.5">{it.title}</td>
//                                   <td className="py-1.5 text-center w-16">{it.qty}</td>
//                                   <td className="py-1.5 text-right w-28">{formatPKR(it.price)}</td>
//                                   <td className="py-1.5 text-right w-28 font-medium">
//                                     {formatPKR(it.price * it.qty)}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {placeError && <p className="text-sm text-danger mt-3">{placeError}</p>}

//               <div className="flex gap-3 mt-5">
//                 <Button variant="secondary" onClick={() => setStep(1)}>
//                   Back
//                 </Button>
//                 <Button variant="primary" loading={placing} onClick={handlePlaceOrder}>
//                   Place Order
//                 </Button>
//               </div>
//             </Card>
//           )}
//         </div>

//         {/* ---------------- Right column: summary ---------------- */}
//         <Card className="h-fit lg:sticky lg:top-24">
//           <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>

//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between text-gray-500">
//               <span>Subtotal ({itemCount})</span>
//               <span className="text-gray-800 font-medium">{formatPKR(subtotal)}</span>
//             </div>
//             <div className="flex justify-between text-gray-500">
//               <span>Delivery</span>
//               <span className="text-gray-800 font-medium">{formatPKR(delivery)}</span>
//             </div>
//             <div className="border-t pt-2 flex justify-between font-semibold text-gray-800 text-base">
//               <span>Total</span>
//               <span className="text-primary">{formatPKR(grandTotal)}</span>
//             </div>
//           </div>

//           <p className="text-[11px] text-gray-400 mt-3">
//             This is an estimate. The final amount is calculated by the server when your order is
//             created and shown on the order details page.
//           </p>
//         </Card>
//       </div>
//     </div>
//   )
// }

// function Field({ label, value, onChange, className = '', type = 'text', required = false }) {
//   return (
//     <div className={className}>
//       <label className="text-sm font-medium text-gray-700">
//         {label} {required && <span className="text-danger">*</span>}
//       </label>
//       <input
//         type={type}
//         className="input-field mt-1"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         required={required}
//       />
//     </div>
//   )
// }

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, MapPin, CreditCard, ClipboardCheck, ShoppingCart, Store, Loader2, Info,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import ImageUploader from '../components/common/ImageUploader'
import useStore from '../store/useStore'
import { useAuthContext } from '../context/AuthContext'
import { marketplaceAPI, paymentAccountAPI } from '../services/api'
import {
  cartGroupToOrderRequest,
  paymentAccountFromResponse,
  sellerFromResponse,
  unwrapList,
  unwrapOne,
} from '../utils/marketplaceMapper'
import { paymentMethods } from '../utils/constants'
import { formatPKR } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'
import { EmptyState } from './Marketplace'

const STEPS = ['Delivery', 'Payment', 'Review']

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { cartItems, removeFromCart } = useStore()

  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [placeError, setPlaceError] = useState(null)

  // CASH_ON_DELIVERY is the backend enum name. Sending "COD" used to be
  // rejected with 400 "Invalid payment method".
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY')

  // sellerProfileId -> { loading, accounts: [] }
  const [sellerAccounts, setSellerAccounts] = useState({})
  const [selectedAccountId, setSelectedAccountId] = useState('')

  // Optional transfer proof submitted at checkout time (manual methods only).
  const [proof, setProof] = useState({
    transactionReference: '',
    paidAmount: '',
    paymentProofUrl: '',
  })

  const [buyer, setBuyer] = useState({
    name: user?.name || user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || user?.location || '',
    province: user?.province || '',
  })

  useEffect(() => {
    setBuyer((prev) => ({
      name: prev.name || user?.name || user?.fullName || '',
      email: prev.email || user?.email || '',
      phone: prev.phone || user?.phone || '',
      address: prev.address || user?.address || '',
      city: prev.city || user?.city || user?.location || '',
      province: prev.province || user?.province || '',
    }))
  }, [user])

  const subtotal = cartItems.reduce((sum, c) => sum + c.price * c.qty, 0)
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0)

  const groupedBySeller = useMemo(
    () =>
      Object.entries(
        cartItems.reduce((acc, item) => {
          const key = item.sellerId ?? 'unknown'
          acc[key] = acc[key] || { sellerName: item.sellerName, items: [] }
          acc[key].items.push(item)
          return acc
        }, {})
      ),
    [cartItems]
  )

  const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod)
  const isManual = !!selectedMethod?.manual

  // A manual transfer needs the seller's receiving accounts. The endpoint takes
  // the seller's USER id, so the seller profile has to be fetched first.
  useEffect(() => {
    if (!isManual) return

    const missing = groupedBySeller
      .map(([id]) => id)
      .filter((id) => id !== 'unknown' && sellerAccounts[id] === undefined)

    if (!missing.length) return

    let cancelled = false
    setSellerAccounts((prev) => ({
      ...prev,
      ...Object.fromEntries(missing.map((id) => [id, { loading: true, accounts: [] }])),
    }))

    Promise.all(
      missing.map(async (sellerProfileId) => {
        try {
          const profileRes = await marketplaceAPI.getSellerProfile(sellerProfileId)
          const profile = sellerFromResponse(unwrapOne(profileRes))

          if (!profile?.userId) return [sellerProfileId, { loading: false, accounts: [] }]

          const accRes = await paymentAccountAPI.getForSeller(profile.userId)
          const accounts = unwrapList(accRes)
            .map(paymentAccountFromResponse)
            .filter((a) => a.active)

          return [sellerProfileId, { loading: false, accounts }]
        } catch {
          return [sellerProfileId, { loading: false, accounts: [] }]
        }
      })
    ).then((entries) => {
      if (cancelled) return
      setSellerAccounts((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, groupedBySeller])

  // Reset the chosen account whenever the method changes.
  useEffect(() => {
    setSelectedAccountId('')
  }, [paymentMethod])

  if (!user) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Please login to continue."
        subtitle="You need to be signed in before placing an order."
        action={
          <Button variant="primary" className="mt-4" onClick={() => navigate('/login')}>
            Login
          </Button>
        }
      />
    )
  }

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Nothing to check out"
        subtitle="Your cart is empty."
        action={
          <Button variant="primary" className="mt-4" onClick={() => navigate('/marketplace')}>
            Browse Products
          </Button>
        }
      />
    )
  }

  const deliveryAddress = [buyer.address, buyer.city, buyer.province]
    .filter(Boolean)
    .join(', ')

  // Accounts matching the chosen method, across every seller in the cart.
  const matchingAccounts = groupedBySeller.flatMap(([sellerId, group]) => {
    const entry = sellerAccounts[sellerId]
    if (!entry || entry.loading) return []
    return entry.accounts
      .filter((a) => a.type === selectedMethod?.accountType)
      .map((a) => ({ ...a, sellerName: group.sellerName, sellerId }))
  })

  const accountsLoading = groupedBySeller.some(([id]) => sellerAccounts[id]?.loading)

  const validateBuyer = () => {
    const missing =
      (!buyer.name.trim() && 'your full name') ||
      (!buyer.phone.trim() && 'a contact phone number') ||
      (!buyer.address.trim() && 'a delivery address') ||
      (!buyer.city.trim() && 'your city')

    if (missing) {
      toast.error(`Please enter ${missing}`)
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    const unknownSeller = groupedBySeller.some(([id]) => id === 'unknown')
    if (unknownSeller) {
      toast.error('One of your cart items is missing its seller. Please remove and re-add it.')
      return
    }

    setPlacing(true)
    setPlaceError(null)

    try {
      const created = []

      // The backend creates one order per seller (OrderRequest.sellerId is required).
      for (const [sellerIdRaw, group] of groupedBySeller) {
        const accountForSeller = matchingAccounts.find(
          (a) => String(a.id) === String(selectedAccountId) && a.sellerId === sellerIdRaw
        )

        // Prices are never sent — the server re-prices every line from the DB.
        const payload = cartGroupToOrderRequest(sellerIdRaw, group.items, {
          deliveryAddress,
          buyerName: buyer.name,
          phone: buyer.phone,
          city: buyer.city,
          province: buyer.province,
          paymentMethod,
          ...(isManual && accountForSeller ? { paymentAccountId: accountForSeller.id } : {}),
          ...(isManual && proof.transactionReference
            ? {
                transactionReference: proof.transactionReference,
                paidAmount: proof.paidAmount === '' ? undefined : proof.paidAmount,
                paymentProofUrl: proof.paymentProofUrl || undefined,
              }
            : {}),
        })

        const res = await marketplaceAPI.createOrder(payload)
        created.push(unwrapOne(res))

        group.items.forEach((it) => removeFromCart(it.productId))
      }

      const first = created[0]

      toast.success(
        created.length > 1
          ? `${created.length} orders placed successfully!`
          : 'Order placed successfully!'
      )

      navigate(first?.id ? `/marketplace/orders/${first.id}` : '/marketplace/orders')
    } catch (err) {
      const message = getApiErrorMessage(err, {
        401: 'Please login to continue.',
        403: "You don't have permission to perform this action.",
        404: 'Product or seller not found.',
        409: 'One of these products is no longer available in the requested quantity.',
      })

      setPlaceError(message)
      toast.error(message)
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/marketplace/cart')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft size={16} /> Back to Cart
      </button>

      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                i <= step ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`ml-2 text-xs font-medium ${i <= step ? 'text-gray-700' : 'text-gray-400'}`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-3 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* ---------------- Step 0: delivery ---------------- */}
          {step === 0 && (
            <Card>
              <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <MapPin size={16} /> Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Full Name" required value={buyer.name} onChange={(v) => setBuyer({ ...buyer, name: v })} />
                <Field label="Email" type="email" value={buyer.email} onChange={(v) => setBuyer({ ...buyer, email: v })} />
                <Field label="Phone" type="tel" required value={buyer.phone} onChange={(v) => setBuyer({ ...buyer, phone: v })} />
                <Field label="City" required value={buyer.city} onChange={(v) => setBuyer({ ...buyer, city: v })} />
                <Field label="Province" value={buyer.province} onChange={(v) => setBuyer({ ...buyer, province: v })} />
                <Field label="Delivery Address" required className="sm:col-span-2" value={buyer.address} onChange={(v) => setBuyer({ ...buyer, address: v })} />
              </div>

              <Button variant="primary" className="mt-5" onClick={() => validateBuyer() && setStep(1)}>
                Continue to Payment
              </Button>
            </Card>
          )}

          {/* ---------------- Step 1: payment ---------------- */}
          {step === 1 && (
            <Card>
              <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard size={16} /> Payment Method
              </h2>

              <div className="space-y-2">
                {paymentMethods.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === opt.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="mt-1"
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        <span className="mr-1.5">{opt.icon}</span>
                        {opt.name}
                      </p>
                      <p className="text-xs text-gray-500">{opt.hint}</p>
                    </div>
                  </label>
                ))}
              </div>

              {isManual && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3.5 space-y-3">
                  <p className="text-xs font-semibold text-gray-700">
                    Where to send the money
                  </p>

                  {accountsLoading ? (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Loader2 size={13} className="animate-spin" /> Loading seller accounts…
                    </p>
                  ) : matchingAccounts.length === 0 ? (
                    <p className="text-xs text-gray-500 flex items-start gap-1.5">
                      <Info size={13} className="mt-0.5 shrink-0" />
                      This seller hasn&apos;t registered a {selectedMethod.name} account yet. You can
                      still place the order — they&apos;ll share payment details after confirming it,
                      and you can submit the transaction ID from the order page.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {matchingAccounts.map((acc) => (
                        <label
                          key={acc.id}
                          className={`flex items-start gap-3 p-2.5 border rounded-lg cursor-pointer bg-white transition-colors ${
                            String(selectedAccountId) === String(acc.id)
                              ? 'border-primary'
                              : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentAccount"
                            className="mt-1"
                            checked={String(selectedAccountId) === String(acc.id)}
                            onChange={() => setSelectedAccountId(acc.id)}
                          />
                          <div className="text-xs text-gray-600">
                            <p className="font-medium text-gray-800 flex items-center gap-1">
                              <Store size={11} /> {acc.sellerName || 'Seller'}
                            </p>
                            <p>{acc.accountTitle}</p>
                            <p className="font-mono">{acc.accountNumber}</p>
                            {acc.bankName && <p>{acc.bankName}</p>}
                            {acc.iban && <p className="font-mono">IBAN: {acc.iban}</p>}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="pt-1 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Already transferred? Add the proof now (optional)
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field
                        label="Transaction / TID"
                        value={proof.transactionReference}
                        onChange={(v) => setProof({ ...proof, transactionReference: v })}
                      />
                      <Field
                        label="Amount Paid"
                        type="number"
                        value={proof.paidAmount}
                        onChange={(v) => setProof({ ...proof, paidAmount: v })}
                      />
                    </div>

                    <div className="mt-3">
                      <ImageUploader
                        label="Receipt / Screenshot"
                        folder="payments"
                        value={proof.paymentProofUrl}
                        onChange={(url) => setProof({ ...proof, paymentProofUrl: url })}
                      />
                    </div>

                    <p className="text-[11px] text-gray-400 mt-2">
                      You can also do this later from the order page. SmartAgri never collects card
                      details and does not process payments.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
                <Button variant="primary" onClick={() => setStep(2)}>Continue to Review</Button>
              </div>
            </Card>
          )}

          {/* ---------------- Step 2: review ---------------- */}
          {step === 2 && (
            <Card>
              <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <ClipboardCheck size={16} /> Review Your Order
              </h2>

              <div className="text-sm text-gray-600 mb-4">
                <p className="font-medium text-gray-800">Deliver to</p>
                <p>{buyer.name} · {buyer.phone}</p>
                <p>{deliveryAddress}</p>
                <p className="mt-2 font-medium text-gray-800">Payment</p>
                <p>{selectedMethod?.name}</p>
              </div>

              <div className="overflow-x-auto">
                {groupedBySeller.map(([sellerId, group]) => (
                  <div key={sellerId} className="mb-3 last:mb-0">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Store size={11} /> {group.sellerName || 'Seller'}
                    </p>
                    <table className="w-full text-sm">
                      <tbody>
                        {group.items.map((it) => (
                          <tr key={it.productId} className="border-b last:border-0">
                            <td className="py-1.5">{it.title}</td>
                            <td className="py-1.5 text-center w-16">{it.qty}</td>
                            <td className="py-1.5 text-right w-28">{formatPKR(it.price)}</td>
                            <td className="py-1.5 text-right w-28 font-medium">
                              {formatPKR(it.price * it.qty)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {placeError && <p className="text-sm text-danger mt-3">{placeError}</p>}

              <div className="flex gap-3 mt-5">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" loading={placing} onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* ---------------- Summary ---------------- */}
        <Card className="h-fit lg:sticky lg:top-24">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Items ({itemCount})</span>
              <span className="text-gray-800 font-medium">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery</span>
              <span className="text-gray-800">Calculated at checkout</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-gray-800 text-base">
              <span>Estimated Total</span>
              <span className="text-primary">{formatPKR(subtotal)}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-3">
            The server recalculates every price, applies delivery charges and any coupon, then
            returns the final total on the order page.
          </p>
        </Card>
      </div>
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
