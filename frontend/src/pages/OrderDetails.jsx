// import { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { ChevronLeft, MapPin, Phone, CreditCard, Store, Package } from 'lucide-react'
// import Card from '../components/common/Card'
// import Button from '../components/common/Button'
// import Loader from '../components/common/Loader'
// import OrderTimeline from '../components/marketplace/OrderTimeline'
// import { marketplaceAPI } from '../services/api'
// import { orderFromResponse } from '../utils/marketplaceMapper'
// import {
//   orderStatusColor,
//   paymentMethodLabel,
//   paymentStatusColor,
//   paymentStatusLabel,
// } from '../utils/constants'
// import { formatPKR, formatDateTime } from '../utils/format'
// import { getApiErrorMessage } from '../utils/apiError'
// import { ErrorState } from './Marketplace'

// export default function OrderDetails() {
//   const { id } = useParams()
//   const navigate = useNavigate()

//   const [order, setOrder] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const load = async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       const res = await marketplaceAPI.getOrderById(id)
//       const raw = res.data?.data ?? res.data

//       if (!raw) throw new Error('empty')

//       setOrder(orderFromResponse(raw))
//     } catch (err) {
//       setError(
//         getApiErrorMessage(err, {
//           404: 'Order not found.',
//           403: "You don't have permission to view this order.",
//         })
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     load()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id])

//   if (loading) {
//     return (
//       <div className="py-24 flex justify-center">
//         <Loader label="Loading order..." />
//       </div>
//     )
//   }

//   if (error || !order) {
//     return <ErrorState message={error || 'Order not found.'} onRetry={load} />
//   }

//   const itemsSubtotal = order.subtotal || order.items.reduce((s, i) => s + i.subtotal, 0)

//   return (
//     <div className="max-w-4xl mx-auto space-y-5">
//       <button
//         onClick={() => navigate('/marketplace/orders')}
//         className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
//       >
//         <ChevronLeft size={16} /> Back to My Orders
//       </button>

//       {/* Header */}
//       <div className="flex flex-wrap items-start justify-between gap-3">
//         <div>
//           <h1 className="text-xl font-bold text-gray-800">{order.displayId}</h1>
//           <p className="text-xs text-gray-500 mt-1">
//             Placed on {formatDateTime(order.orderDateTime || order.orderDate)}
//           </p>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className={`badge ${orderStatusColor[order.status] || 'badge-info'}`}>
//             {order.status}
//           </span>
//           {order.paymentStatus && (
//             <span className={`badge ${paymentStatusColor[order.paymentStatus] || 'badge-info'}`}>
//               {paymentStatusLabel[order.paymentStatus] || order.paymentStatus}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Progress */}
//       <Card>
//         <h2 className="font-semibold text-gray-800 text-sm mb-1">Order Progress</h2>
//         <OrderTimeline status={order.status} />
//       </Card>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         {/* Items */}
//         <Card className="lg:col-span-2">
//           <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-3">
//             <Package size={15} /> Items
//           </h2>

//           {order.sellerName && (
//             <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
//               <Store size={11} /> Sold by {order.sellerName}
//             </p>
//           )}

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-xs text-gray-400 border-b">
//                   <th className="py-2">Product</th>
//                   <th className="py-2 text-center">Qty</th>
//                   <th className="py-2 text-right">Price</th>
//                   <th className="py-2 text-right">Subtotal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {order.items.map((it) => (
//                   <tr key={it.productId} className="border-b last:border-0">
//                     <td className="py-2.5">
//                       <button
//                         onClick={() => navigate(`/marketplace/product/${it.productId}`)}
//                         className="text-left hover:text-primary"
//                       >
//                         {it.title}
//                       </button>
//                     </td>
//                     <td className="py-2.5 text-center">
//                       {it.qty} {it.unit}
//                     </td>
//                     <td className="py-2.5 text-right">{formatPKR(it.price)}</td>
//                     <td className="py-2.5 text-right font-medium">{formatPKR(it.subtotal)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-4 space-y-1.5 text-sm max-w-xs ml-auto">
//             <div className="flex justify-between text-gray-500">
//               <span>Subtotal</span>
//               <span className="text-gray-800">{formatPKR(itemsSubtotal)}</span>
//             </div>
//             <div className="flex justify-between text-gray-500">
//               <span>Delivery</span>
//               <span className="text-gray-800">{formatPKR(order.deliveryCharges)}</span>
//             </div>
//             <div className="flex justify-between font-semibold text-base border-t pt-1.5">
//               <span className="text-gray-800">Total</span>
//               <span className="text-primary">{formatPKR(order.totalAmount)}</span>
//             </div>
//           </div>
//         </Card>

//         {/* Delivery + payment */}
//         <div className="space-y-5">
//           <Card>
//             <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-2">
//               <MapPin size={15} /> Delivery
//             </h2>
//             <p className="text-sm text-gray-600">{order.deliveryAddress || '—'}</p>
//             {(order.city || order.province) && (
//               <p className="text-sm text-gray-600">
//                 {[order.city, order.province].filter(Boolean).join(', ')}
//               </p>
//             )}
//             {order.phone && (
//               <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1.5">
//                 <Phone size={13} /> {order.phone}
//               </p>
//             )}
//           </Card>

//           <Card>
//             <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-2">
//               <CreditCard size={15} /> Payment
//             </h2>
//             <p className="text-sm text-gray-600">
//               {paymentMethodLabel[order.paymentMethod] || order.paymentMethod || 'Cash on Delivery'}
//             </p>
//             {order.paymentStatus && (
//               <span
//                 className={`badge mt-2 inline-block ${
//                   paymentStatusColor[order.paymentStatus] || 'badge-info'
//                 }`}
//               >
//                 {paymentStatusLabel[order.paymentStatus] || order.paymentStatus}
//               </span>
//             )}
//           </Card>

//           <Button variant="outline" className="w-full" onClick={() => navigate('/marketplace')}>
//             Continue Shopping
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, MapPin, Phone, CreditCard, Store, Package, Upload, CheckCircle2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import ImageUploader from '../components/common/imageUploader'
import OrderTimeline from '../components/marketplace/OrderTimeline'
import { marketplaceAPI, paymentAPI } from '../services/api'
import { orderFromResponse, unwrapOne } from '../utils/marketplaceMapper'
import { useAuthContext } from '../context/AuthContext'
import {
  orderStatusColor,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusColor,
  paymentStatusLabel,
} from '../utils/constants'
import { formatPKR, formatDateTime } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'
import { ErrorState } from './Marketplace'

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showProofForm, setShowProofForm] = useState(false)
  const [submittingProof, setSubmittingProof] = useState(false)
  const [proof, setProof] = useState({
    transactionReference: '',
    paidAmount: '',
    paymentProofUrl: '',
  })

  const load = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await marketplaceAPI.getOrderById(id)
      const raw = unwrapOne(res)

      if (!raw) throw new Error('empty')

      setOrder(orderFromResponse(raw))
    } catch (err) {
      setError(
        getApiErrorMessage(err, {
          404: 'Order not found.',
          403: "You don't have permission to view this order.",
          401: 'Please login to continue.',
        })
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleSubmitProof = async () => {
    if (!proof.transactionReference.trim()) {
      toast.error('Please enter the transaction / reference number')
      return
    }
    if (proof.paidAmount === '' || Number(proof.paidAmount) <= 0) {
      toast.error('Please enter the amount you transferred')
      return
    }

    setSubmittingProof(true)

    try {
      await paymentAPI.submitProof(order.id, {
        transactionReference: proof.transactionReference.trim(),
        paidAmount: Number(proof.paidAmount),
        paymentProofUrl: proof.paymentProofUrl || undefined,
        ...(order.payment?.account?.id ? { paymentAccountId: order.payment.account.id } : {}),
      })

      toast.success('Payment details submitted. The seller will verify it shortly.')
      setShowProofForm(false)
      setProof({ transactionReference: '', paidAmount: '', paymentProofUrl: '' })
      await load()
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, {
          404: 'Order not found.',
          403: 'Only the buyer of this order can submit payment details.',
        })
      )
    } finally {
      setSubmittingProof(false)
    }
  }

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader label="Loading order..." />
      </div>
    )
  }

  if (error || !order) {
    return <ErrorState message={error || 'Order not found.'} onRetry={load} />
  }

  const payment = order.payment
  const isBuyer = user?.id != null && String(user.id) === String(order.buyerId)
  const isManualMethod = payment && payment.method && payment.method !== 'CASH_ON_DELIVERY'

  // A manual transfer can be submitted (or resubmitted after a rejection)
  // while it hasn't been verified yet.
  const canSubmitProof =
    isBuyer &&
    isManualMethod &&
    ['PAYMENT_PENDING', 'PAYMENT_REJECTED'].includes(payment.status)

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <button
        onClick={() => navigate('/marketplace/orders')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft size={16} /> Back to My Orders
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{order.displayId}</h1>
          <p className="text-xs text-gray-500 mt-1">
            Placed on {formatDateTime(order.orderDateTime || order.orderDate)}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${orderStatusColor[order.status] || 'badge-info'}`}>
            {orderStatusLabel[order.status] || order.status}
          </span>
          {order.paymentStatus && (
            <span className={`badge ${paymentStatusColor[order.paymentStatus] || 'badge-info'}`}>
              {paymentStatusLabel[order.paymentStatus] || order.paymentStatus}
            </span>
          )}
        </div>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-800 text-sm mb-1">Order Progress</h2>
        <OrderTimeline status={order.status} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-3">
            <Package size={15} /> Items
          </h2>

          {order.sellerName && (
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Store size={11} /> Sold by {order.sellerName}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b">
                  <th className="py-2">Product</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.productId} className="border-b last:border-0">
                    <td className="py-2.5">
                      <button
                        onClick={() => navigate(`/marketplace/product/${it.productId}`)}
                        className="text-left hover:text-primary"
                      >
                        {it.title}
                      </button>
                    </td>
                    <td className="py-2.5 text-center">{it.qty} {it.unit}</td>
                    <td className="py-2.5 text-right">{formatPKR(it.price)}</td>
                    <td className="py-2.5 text-right font-medium">{formatPKR(it.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-1.5 text-sm max-w-xs ml-auto">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="text-gray-800">{formatPKR(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                <span className="text-success">− {formatPKR(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Delivery</span>
              <span className="text-gray-800">{formatPKR(order.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t pt-1.5">
              <span className="text-gray-800">Total</span>
              <span className="text-primary">{formatPKR(order.totalAmount)}</span>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-2">
              <MapPin size={15} /> Delivery
            </h2>
            <p className="text-sm text-gray-600">{order.deliveryAddress || '—'}</p>
            {(order.city || order.province) && (
              <p className="text-sm text-gray-600">
                {[order.city, order.province].filter(Boolean).join(', ')}
              </p>
            )}
            {order.phone && (
              <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1.5">
                <Phone size={13} /> {order.phone}
              </p>
            )}
          </Card>

          <Card>
            <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-2">
              <CreditCard size={15} /> Payment
            </h2>

            <p className="text-sm text-gray-600">
              {paymentMethodLabel[order.paymentMethod] || order.paymentMethod || 'Cash on Delivery'}
            </p>

            {order.paymentStatus && (
              <span
                className={`badge mt-2 inline-block ${
                  paymentStatusColor[order.paymentStatus] || 'badge-info'
                }`}
              >
                {paymentStatusLabel[order.paymentStatus] || order.paymentStatus}
              </span>
            )}

            {/* Where to pay, for a manual transfer */}
            {payment?.account && (
              <div className="mt-3 text-xs text-gray-600 border-t pt-2.5 space-y-0.5">
                <p className="font-medium text-gray-700">Pay into</p>
                <p>{payment.account.accountTitle}</p>
                <p className="font-mono">{payment.account.accountNumber}</p>
                {payment.account.bankName && <p>{payment.account.bankName}</p>}
                {payment.account.iban && <p className="font-mono">IBAN: {payment.account.iban}</p>}
              </div>
            )}

            {/* What the buyer already submitted */}
            {payment?.transactionReference && (
              <div className="mt-3 text-xs text-gray-600 border-t pt-2.5 space-y-0.5">
                <p className="font-medium text-gray-700">Your transfer</p>
                <p>TID: <span className="font-mono">{payment.transactionReference}</span></p>
                {payment.paidAmount != null && <p>Amount: {formatPKR(payment.paidAmount)}</p>}
                {payment.paymentProofUrl && (
                  <a
                    href={payment.paymentProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline inline-block mt-1"
                  >
                    View receipt
                  </a>
                )}
              </div>
            )}

            {payment?.rejectionReason && (
              <p className="mt-2 text-xs text-danger">
                Rejected: {payment.rejectionReason}
              </p>
            )}

            {payment?.status === 'PAYMENT_VERIFIED' || payment?.status === 'PAYMENT_PAID' ? (
              <p className="mt-3 text-xs text-success flex items-center gap-1">
                <CheckCircle2 size={13} /> Payment confirmed by the seller
              </p>
            ) : null}

            {canSubmitProof && !showProofForm && (
              <Button
                size="sm"
                variant="primary"
                className="w-full mt-3"
                onClick={() => setShowProofForm(true)}
              >
                <Upload size={14} />
                {payment.status === 'PAYMENT_REJECTED' ? 'Resubmit payment' : 'I have paid'}
              </Button>
            )}

            {canSubmitProof && showProofForm && (
              <div className="mt-3 border-t pt-3 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">
                    Transaction / TID <span className="text-danger">*</span>
                  </label>
                  <input
                    className="input-field mt-1"
                    value={proof.transactionReference}
                    onChange={(e) =>
                      setProof({ ...proof, transactionReference: e.target.value })
                    }
                    disabled={submittingProof}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700">
                    Amount Paid <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input-field mt-1"
                    value={proof.paidAmount}
                    onChange={(e) => setProof({ ...proof, paidAmount: e.target.value })}
                    disabled={submittingProof}
                  />
                </div>

                <ImageUploader
                  label="Receipt / Screenshot"
                  folder="payments"
                  value={proof.paymentProofUrl}
                  onChange={(url) => setProof({ ...proof, paymentProofUrl: url })}
                  disabled={submittingProof}
                />

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowProofForm(false)}
                    disabled={submittingProof}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    loading={submittingProof}
                    onClick={handleSubmitProof}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Button variant="outline" className="w-full" onClick={() => navigate('/marketplace')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
