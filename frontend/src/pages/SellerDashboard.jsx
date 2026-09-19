// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Package, ClipboardList, TrendingUp, Plus, Pencil, Trash2, Star, Store, Users,
//   Clock, XCircle, ShieldAlert, ShieldCheck, RefreshCw, LayoutDashboard, CreditCard,
//   Settings2, CheckCircle2, Truck, MapPin, Phone, Mail,
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Card from '../components/common/Card'
// import Button from '../components/common/Button'
// import { SkeletonCard } from '../components/common/Skeleton'
// import ProductFormModal from '../components/marketplace/ProductFormModal'
// import BecomeSellerModal from '../components/marketplace/BecomeSellerModal'
// import OrderTimeline from '../components/marketplace/OrderTimeline'
// import { useAuthContext } from '../context/AuthContext'
// import { marketplaceAPI } from '../services/api'
// import { productFromResponse, productToRequest, orderFromResponse } from '../utils/marketplaceMapper'
// import {
//   orderStatuses, orderStatusColor, productStatusLabel, productStatusColor,
//   paymentMethodLabel, paymentStatusColor, paymentStatusLabel,
// } from '../utils/constants'
// import { sellerPaymentDetails } from '../utils/marketplaceMapper'
// import { formatPKR, formatDate } from '../utils/format'
// import { getApiErrorMessage } from '../utils/apiError'
// import { EmptyState, ErrorState } from './Marketplace'

// export default function SellerDashboard() {
//   const navigate = useNavigate()
//   const { user, isSeller, becomeSeller, fetchMySellerProfile } = useAuthContext()

//   const [tab, setTab] = useState('dashboard') // dashboard | listings | orders | payments | settings
//   const [listings, setListings] = useState([])
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [statusChecked, setStatusChecked] = useState(false)

//   const [showProductModal, setShowProductModal] = useState(false)
//   const [editingProduct, setEditingProduct] = useState(null)
//   const [showSellerModal, setShowSellerModal] = useState(false)
//   const [expandedOrder, setExpandedOrder] = useState(null)

//   // Re-check the seller application's status on every visit - it may have
//   // been approved/rejected/suspended by an admin since the user last logged in.
//   useEffect(() => {
//     (async () => {
//       await fetchMySellerProfile()
//       setStatusChecked(true)
//     })()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const load = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const [listingsRes, ordersRes] = await Promise.all([
//         marketplaceAPI.getMyListings(),
//         marketplaceAPI.getSellerOrders(),
//       ])
//       setListings((listingsRes.data?.data ?? listingsRes.data ?? []).map(productFromResponse))
//       setOrders((ordersRes.data?.data ?? ordersRes.data ?? []).map(orderFromResponse))
//     } catch (err) {
//       setError(getApiErrorMessage(err))
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { if (isSeller) load() }, [isSeller])

//   const totalSales = useMemo(
//     () => orders.filter((o) => o.status === 'Delivered').reduce((s, o) => s + o.totalAmount, 0),
//     [orders]
//   )
//   const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'Pending').length, [orders])
//   const totalRevenue = useMemo(
//     () => orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.totalAmount, 0),
//     [orders]
//   )
//   const uniqueCustomers = useMemo(() => new Set(orders.map((o) => o.buyerId)).size, [orders])
//   const activeListings = useMemo(
//     () => listings.filter((p) => p.status === 'APPROVED' && p.stock > 0).length,
//     [listings]
//   )
//   const deliveredOrders = useMemo(
//     () => orders.filter((o) => o.status === 'Delivered').length,
//     [orders]
//   )
//   const paymentDetails = useMemo(
//     () => sellerPaymentDetails(user?.sellerProfile),
//     [user?.sellerProfile]
//   )
//   const avgRating = useMemo(() => {
//     const rated = listings.filter((p) => p.reviewsCount > 0)
//     if (!rated.length) return null
//     return rated.reduce((s, p) => s + p.rating, 0) / rated.length
//   }, [listings])

//   const handleBecomeSeller = async (data) => {
//     const res = await becomeSeller(data)
//     if (res.success) setShowSellerModal(false)
//   }

//   const handleSaveProduct = async (data) => {
//     try {
//       if (editingProduct) {
//         const res = await marketplaceAPI.updateProduct(editingProduct.id, productToRequest(data))
//         const updated = productFromResponse(res.data?.data ?? res.data)
//         setListings((prev) => prev.map((p) => p.id === editingProduct.id ? updated : p))
//         toast.success(res.data?.message || 'Listing updated')
//       } else {
//         const res = await marketplaceAPI.createProduct(productToRequest(data))
//         const created = productFromResponse(res.data?.data ?? res.data)
//         setListings((prev) => [created, ...prev])
//         toast.success(res.data?.message || 'Product submitted for approval')
//       }
//       setShowProductModal(false)
//       setEditingProduct(null)
//     } catch (err) {
//       toast.error(getApiErrorMessage(err, { 409: 'A listing with these details already exists.' }))
//     }
//   }

//   const handleDeleteProduct = async (id) => {
//     if (!window.confirm('Remove this listing? This cannot be undone.')) return
//     try {
//       await marketplaceAPI.deleteProduct(id)
//       setListings((prev) => prev.filter((p) => p.id !== id))
//       toast.success('Listing removed')
//     } catch (err) {
//       toast.error(getApiErrorMessage(err, { 404: 'Product not found.' }))
//     }
//   }

//   const handleUpdateOrderStatus = async (orderId, status) => {
//     try {
//       await marketplaceAPI.updateOrderStatus(orderId, status.toUpperCase())
//       toast.success(`Order marked as ${status}`)
//       // Refresh from the backend so totals / payment status stay authoritative.
//       await load()
//     } catch (err) {
//       toast.error(getApiErrorMessage(err, { 404: 'Order not found.' }))
//     }
//   }

//   // While we're re-checking the application status with the backend, avoid
//   // flashing the "not a seller" screen for someone who actually is one.
//   if (!statusChecked) {
//     return (
//       <div className="max-w-md mx-auto py-16 text-center">
//         <RefreshCw size={28} className="mx-auto text-gray-300 mb-4 animate-spin" />
//         <p className="text-sm text-gray-400">Checking your seller status…</p>
//       </div>
//     )
//   }

//   const sellerStatus = (user?.sellerProfile?.status || '').toUpperCase()

//   if (!isSeller) {
//     if (sellerStatus === 'PENDING') {
//       return (
//         <div className="max-w-md mx-auto py-16 text-center">
//           <Clock size={40} className="mx-auto text-amber-400 mb-4" />
//           <h2 className="text-lg font-semibold text-gray-800">Your seller application is pending review</h2>
//           <p className="text-sm text-gray-500 mt-2">
//             {user.sellerProfile.shopName ? `"${user.sellerProfile.shopName}" is` : 'Your application is'} waiting
//             for an admin to approve it. You'll be able to list products here as soon as it's approved.
//           </p>
//           <Button variant="secondary" className="mt-5" onClick={async () => { setStatusChecked(false); await fetchMySellerProfile(); setStatusChecked(true) }}>
//             <RefreshCw size={15} /> Check again
//           </Button>
//         </div>
//       )
//     }

//     if (sellerStatus === 'REJECTED') {
//       return (
//         <div className="max-w-md mx-auto py-16 text-center">
//           <XCircle size={40} className="mx-auto text-danger mb-4" />
//           <h2 className="text-lg font-semibold text-gray-800">Your seller application wasn't approved</h2>
//           {user.sellerProfile.moderationReason && (
//             <p className="text-sm text-gray-500 mt-2">Reason: {user.sellerProfile.moderationReason}</p>
//           )}
//           <Button variant="primary" className="mt-5" onClick={() => setShowSellerModal(true)}>Apply again</Button>
//           {showSellerModal && (
//             <BecomeSellerModal onClose={() => setShowSellerModal(false)} onSubmit={handleBecomeSeller} />
//           )}
//         </div>
//       )
//     }

//     if (sellerStatus === 'SUSPENDED') {
//       return (
//         <div className="max-w-md mx-auto py-16 text-center">
//           <ShieldAlert size={40} className="mx-auto text-danger mb-4" />
//           <h2 className="text-lg font-semibold text-gray-800">Your seller account is suspended</h2>
//           <p className="text-sm text-gray-500 mt-2">
//             {user.sellerProfile.moderationReason || 'Contact support to find out more about this suspension.'}
//           </p>
//         </div>
//       )
//     }

//     return (
//       <div className="max-w-md mx-auto py-16 text-center">
//         <Store size={40} className="mx-auto text-gray-300 mb-4" />
//         <h2 className="text-lg font-semibold text-gray-800">You're not registered as a seller yet</h2>
//         <p className="text-sm text-gray-500 mt-2 mb-5">Set up a seller profile to start listing products on the marketplace.</p>
//         <Button variant="primary" onClick={() => setShowSellerModal(true)}>Become a Seller</Button>
//         {showSellerModal && (
//           <BecomeSellerModal onClose={() => setShowSellerModal(false)} onSubmit={handleBecomeSeller} />
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h1 className="text-xl font-bold text-gray-800 flex items-center gap-1.5">
//             Seller Dashboard
//             {user?.sellerProfile?.verified && (
//               <span title="Verified seller"><ShieldCheck size={16} className="text-primary" /></span>
//             )}
//           </h1>
//           <p className="text-sm text-gray-500">{user?.sellerProfile?.shopName || 'Your store'}</p>
//         </div>
//         {user?.sellerProfile?.id && (
//           <button
//             onClick={() => navigate(`/marketplace/seller/${user.sellerProfile.id}`)}
//             className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
//           >
//             View public storefront
//           </button>
//         )}
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
//       ) : error ? (
//         <ErrorState message={error} onRetry={load} />
//       ) : (
//         <>
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//             <StatCard icon={Package} color="primary" label="Total Products" value={listings.length} />
//             <StatCard icon={CheckCircle2} color="success" label="Active Products" value={activeListings} />
//             <StatCard icon={ClipboardList} color="secondary" label="Total Orders" value={orders.length} />
//             <StatCard icon={Clock} color="warning" label="Pending Orders" value={pendingOrders} />
//             <StatCard icon={Truck} color="info" label="Delivered Orders" value={deliveredOrders} />
//             <StatCard icon={TrendingUp} color="success" label="Total Sales" value={formatPKR(totalSales)} />
//           </div>

//           <div className="flex items-center justify-between border-b border-gray-200 overflow-x-auto">
//             <div className="flex items-center gap-1">
//               <TabButton active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon={LayoutDashboard} label="Dashboard" />
//               <TabButton active={tab === 'listings'} onClick={() => setTab('listings')} icon={Package} label="Products" />
//               <TabButton active={tab === 'orders'} onClick={() => setTab('orders')} icon={ClipboardList} label="Orders" />
//               <TabButton active={tab === 'payments'} onClick={() => setTab('payments')} icon={CreditCard} label="Payment Details" />
//               <TabButton active={tab === 'settings'} onClick={() => setTab('settings')} icon={Settings2} label="Store Settings" />
//             </div>
//             <Button
//               size="sm"
//               variant="primary"
//               className="mb-2 shrink-0 flex items-center gap-1"
//               onClick={() => { setEditingProduct(null); setShowProductModal(true) }}
//             >
//               <Plus size={16} /> Add Product
//             </Button>
//           </div>

//           {tab === 'dashboard' && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               <Card>
//                 <h3 className="font-semibold text-gray-800 text-sm mb-3">Recent Orders</h3>
//                 {orders.length === 0 ? (
//                   <p className="text-sm text-gray-400">No orders yet.</p>
//                 ) : (
//                   <div className="space-y-2">
//                     {orders.slice(0, 5).map((o) => (
//                       <div key={o.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0">
//                         <div className="min-w-0">
//                           <p className="font-medium text-gray-800">{o.displayId}</p>
//                           <p className="text-xs text-gray-500">{formatDate(o.orderDateTime || o.orderDate)}</p>
//                         </div>
//                         <div className="text-right shrink-0">
//                           <p className="font-semibold text-primary">{formatPKR(o.totalAmount)}</p>
//                           <span className={`badge ${orderStatusColor[o.status] || 'badge-info'} text-[10px]`}>{o.status}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <Button size="sm" variant="outline" className="mt-3" onClick={() => setTab('orders')}>
//                   View all orders
//                 </Button>
//               </Card>

//               <Card>
//                 <h3 className="font-semibold text-gray-800 text-sm mb-3">Store Health</h3>
//                 <div className="space-y-2 text-sm">
//                   <Row label="Average rating" value={avgRating != null ? `${avgRating.toFixed(1)} / 5` : '—'} />
//                   <Row label="Unique customers" value={uniqueCustomers} />
//                   <Row label="Revenue (excl. cancelled)" value={formatPKR(totalRevenue)} />
//                   <Row label="Out-of-stock listings" value={listings.filter((p) => p.stock <= 0).length} />
//                   <Row
//                     label="Awaiting approval"
//                     value={listings.filter((p) => p.status === 'PENDING_APPROVAL').length}
//                   />
//                 </div>
//               </Card>
//             </div>
//           )}

//           {tab === 'payments' && (
//             <Card className="max-w-2xl">
//               <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-3">
//                 <CreditCard size={15} /> Payment Details
//               </h3>

//               {paymentDetails ? (
//                 <div className="space-y-2 text-sm">
//                   {paymentDetails.easypaisa && <Row label="EasyPaisa" value={paymentDetails.easypaisa} />}
//                   {paymentDetails.jazzcash && <Row label="JazzCash" value={paymentDetails.jazzcash} />}
//                   {paymentDetails.bankName && <Row label="Bank" value={paymentDetails.bankName} />}
//                   {paymentDetails.accountTitle && <Row label="Account title" value={paymentDetails.accountTitle} />}
//                   {paymentDetails.accountNumber && <Row label="Account / IBAN" value={paymentDetails.accountNumber} />}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500">
//                   No payment details are published on your seller profile yet. Buyers who choose
//                   EasyPaisa, JazzCash or Bank Transfer will be told to arrange payment with you after
//                   the order is confirmed.
//                 </p>
//               )}

//               <p className="text-xs text-gray-400 mt-4">
//                 SmartAgri never collects card details and does not process payments — manual transfers
//                 are reviewed by an admin.
//               </p>
//             </Card>
//           )}

//           {tab === 'settings' && (
//             <Card className="max-w-2xl">
//               <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-3">
//                 <Settings2 size={15} /> Store Settings
//               </h3>

//               <div className="space-y-2 text-sm">
//                 <Row label="Store name" value={user?.sellerProfile?.shopName || '—'} />
//                 <Row label="Seller type" value={user?.sellerProfile?.sellerType || '—'} />
//                 <Row label="Status" value={user?.sellerProfile?.status || '—'} />
//                 <Row
//                   label="Verified"
//                   value={user?.sellerProfile?.verified ? 'Yes' : 'Not yet verified'}
//                 />
//                 <Row label="Description" value={user?.sellerProfile?.description || '—'} />
//                 <Row
//                   label={<span className="flex items-center gap-1"><MapPin size={12} /> Location</span>}
//                   value={user?.sellerProfile?.location || user?.location || '—'}
//                 />
//                 <Row
//                   label={<span className="flex items-center gap-1"><Phone size={12} /> Phone</span>}
//                   value={user?.sellerProfile?.phone || user?.phone || '—'}
//                 />
//                 <Row
//                   label={<span className="flex items-center gap-1"><Mail size={12} /> Email</span>}
//                   value={user?.sellerProfile?.email || user?.email || '—'}
//                 />
//               </div>

//               <div className="flex gap-2 mt-4">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={async () => { await fetchMySellerProfile(); toast.success('Store details refreshed') }}
//                 >
//                   <RefreshCw size={14} /> Refresh
//                 </Button>
//                 {user?.sellerProfile?.id && (
//                   <Button
//                     size="sm"
//                     variant="secondary"
//                     onClick={() => navigate(`/marketplace/seller/${user.sellerProfile.id}`)}
//                   >
//                     View storefront
//                   </Button>
//                 )}
//               </div>
//             </Card>
//           )}

//           {tab === 'listings' && (
//             listings.length === 0 ? (
//               <EmptyState icon={Package} title="No listings yet" subtitle="Publish your first product to start selling."
//                 action={<Button variant="primary" className="mt-4" onClick={() => setShowProductModal(true)}>Add Product</Button>} />
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {listings.map((p) => (
//                   <Card key={p.id} className="!p-4">
//                     <div className="flex items-start gap-3">
//                       <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
//                         {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : p.image}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <p className="font-medium text-gray-800 truncate">{p.title}</p>
//                           {p.status && (
//                             <span className={`badge ${productStatusColor[p.status] || 'badge-info'} text-[10px] shrink-0`}>
//                               {productStatusLabel[p.status] || p.status}
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
//                           <Star size={11} className="text-secondary fill-secondary" /> {p.rating.toFixed(1)} ({p.reviewsCount})
//                         </p>
//                         <p className="text-sm font-semibold text-primary mt-1">{formatPKR(p.price)} / {p.unit}</p>
//                         <p className="text-xs text-gray-400">{p.stock} {p.unit} in stock{p.stock <= 5 && p.stock > 0 ? ' — low stock' : ''}</p>
//                         {(p.status === 'REJECTED' || p.status === 'SUSPENDED') && p.moderationReason && (
//                           <p className="text-xs text-danger mt-1">{p.moderationReason}</p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex gap-2 mt-3">
//                       <button onClick={() => { setEditingProduct(p); setShowProductModal(true) }} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
//                         <Pencil size={13} /> Edit
//                       </button>
//                       <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-red-200 text-danger rounded-lg hover:bg-red-50">
//                         <Trash2 size={13} /> Delete
//                       </button>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )
//           )}

//           {tab === 'orders' && (
//             orders.length === 0 ? (
//               <EmptyState icon={ClipboardList} title="No orders yet" subtitle="Orders from buyers will show up here." />
//             ) : (
//               <div className="space-y-3">
//                 {orders.map((order) => (
//                   <Card key={order.id}>
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                       <button className="text-left flex-1" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
//                         <div className="flex items-center gap-2">
//                           <p className="font-semibold text-gray-800">{order.displayId}</p>
//                           <span className={`badge ${orderStatusColor[order.status] || 'badge-info'}`}>{order.status}</span>
//                           {order.paymentStatus && (
//                             <span className={`badge ${paymentStatusColor[order.paymentStatus] || 'badge-info'}`}>
//                               {paymentStatusLabel[order.paymentStatus] || order.paymentStatus}
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
//                           {order.buyerName || `Buyer #${order.buyerId}`}
//                           <span className="text-gray-300">•</span>
//                           {formatDate(order.orderDateTime || order.orderDate)}
//                           {order.paymentMethod && (
//                             <>
//                               <span className="text-gray-300">•</span>
//                               {paymentMethodLabel[order.paymentMethod] || order.paymentMethod}
//                             </>
//                           )}
//                         </p>
//                         <ul className="text-sm text-gray-600 mt-2 space-y-0.5">
//                           {order.items.map((it) => <li key={it.productId}>{it.qty} {it.unit} × {it.title}</li>)}
//                         </ul>
//                       </button>
//                       <div className="text-left sm:text-right shrink-0">
//                         <p className="font-bold text-primary text-lg">{formatPKR(order.totalAmount)}</p>
//                         {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
//                           <select
//                             className="input-field mt-2 text-xs py-1"
//                             value={order.status}
//                             onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
//                           >
//                             {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
//                           </select>
//                         )}
//                       </div>
//                     </div>
//                     {expandedOrder === order.id && (
//                       <div className="border-t mt-3 pt-3">
//                         <OrderTimeline status={order.status} />
//                       </div>
//                     )}
//                   </Card>
//                 ))}
//               </div>
//             )
//           )}
//         </>
//       )}

//       {showProductModal && (
//         <ProductFormModal
//           initialData={editingProduct}
//           onClose={() => { setShowProductModal(false); setEditingProduct(null) }}
//           onSave={handleSaveProduct}
//         />
//       )}
//     </div>
//   )
// }

// // Static class map — Tailwind's JIT compiler needs literal class names,
// // not interpolated ones like `bg-${color}/10`.
// const statColorClasses = {
//   primary: 'bg-primary/10 text-primary',
//   secondary: 'bg-secondary/10 text-secondary',
//   success: 'bg-success/10 text-success',
//   info: 'bg-info/10 text-info',
//   warning: 'bg-warning/10 text-warning',
// }

// function StatCard({ icon: Icon, color, label, value }) {
//   return (
//     <Card className="flex items-center gap-3">
//       <div className={`p-3 rounded-full ${statColorClasses[color] || statColorClasses.primary}`}><Icon size={20} /></div>
//       <div className="min-w-0">
//         <p className="text-xs text-gray-500 truncate">{label}</p>
//         <p className="text-xl font-bold truncate">{value}</p>
//       </div>
//     </Card>
//   )
// }

// function Row({ label, value }) {
//   return (
//     <div className="flex items-start justify-between gap-4 border-b border-gray-100 last:border-0 py-1.5">
//       <span className="text-gray-500 shrink-0">{label}</span>
//       <span className="text-gray-800 font-medium text-right break-words">{value}</span>
//     </div>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//     >
//       <Icon size={16} /> {label}
//     </button>
//   )
// }

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, ClipboardList, TrendingUp, Plus, Pencil, Trash2, Star, Store, Users,
  Clock, XCircle, ShieldAlert, ShieldCheck, RefreshCw, LayoutDashboard, CreditCard,
  Settings2, CheckCircle2, Truck, MapPin, Phone, Mail, Check, X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { SkeletonCard } from '../components/common/Skeleton'
import ProductFormModal from '../components/marketplace/ProductFormModal'
import BecomeSellerModal from '../components/marketplace/BecomeSellerModal'
import OrderTimeline from '../components/marketplace/OrderTimeline'
import { useAuthContext } from '../context/AuthContext'
import { marketplaceAPI, paymentAPI, paymentAccountAPI } from '../services/api'
import {
  productFromResponse, productToRequest, orderFromResponse,
  paymentAccountFromResponse, unwrapList, unwrapOne,
} from '../utils/marketplaceMapper'
import {
  sellerAssignableStatuses, orderStatusColor, orderStatusLabel,
  productStatusLabel, productStatusColor,
  paymentMethodLabel, paymentStatusColor, paymentStatusLabel, paymentAccountTypes,
} from '../utils/constants'
import { formatPKR, formatDate } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'
import { EmptyState, ErrorState } from './Marketplace'

export default function SellerDashboard() {
  const navigate = useNavigate()
  const { user, isSeller, becomeSeller, fetchMySellerProfile } = useAuthContext()

  const [tab, setTab] = useState('dashboard')
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusChecked, setStatusChecked] = useState(false)

  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showSellerModal, setShowSellerModal] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)

  // Payment accounts + manual transfers awaiting this seller's verification.
  const [accounts, setAccounts] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [accountForm, setAccountForm] = useState(null)

  // Re-check the application status on every visit — an admin may have
  // approved/rejected/suspended it since the last login.
  useEffect(() => {
    (async () => {
      await fetchMySellerProfile()
      setStatusChecked(true)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const load = async () => {
    setLoading(true)
    setError(null)

    try {
      const [listingsRes, ordersRes] = await Promise.all([
        marketplaceAPI.getMyListings(),
        marketplaceAPI.getSellerOrders(),
      ])

      setListings(unwrapList(listingsRes).map(productFromResponse))
      setOrders(unwrapList(ordersRes).map(orderFromResponse))
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const loadPayments = async () => {
    setAccountsLoading(true)

    try {
      const [accRes, pendRes] = await Promise.all([
        paymentAccountAPI.getMine(),
        paymentAPI.getSellerPending(),
      ])

      setAccounts(unwrapList(accRes).map(paymentAccountFromResponse))
      setPendingPayments(unwrapList(pendRes))
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setAccountsLoading(false)
    }
  }

  useEffect(() => {
    if (isSeller) load()
  }, [isSeller])

  useEffect(() => {
    if (isSeller && tab === 'payments') loadPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSeller, tab])

  // ---------------- derived stats ----------------
  const totalSales = useMemo(
    () => orders.filter((o) => o.status === 'DELIVERED').reduce((s, o) => s + o.totalAmount, 0),
    [orders]
  )
  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status !== 'CANCELLED').reduce((s, o) => s + o.totalAmount, 0),
    [orders]
  )
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'PENDING').length, [orders])
  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.status === 'DELIVERED').length,
    [orders]
  )
  const uniqueCustomers = useMemo(() => new Set(orders.map((o) => o.buyerId)).size, [orders])
  const activeListings = useMemo(
    () => listings.filter((p) => p.status === 'APPROVED' && p.stock > 0).length,
    [listings]
  )
  const avgRating = useMemo(() => {
    const rated = listings.filter((p) => p.reviewsCount > 0)
    if (!rated.length) return null
    return rated.reduce((s, p) => s + p.rating, 0) / rated.length
  }, [listings])

  // ---------------- handlers ----------------
  const handleBecomeSeller = async (data) => {
    const res = await becomeSeller(data)
    if (res.success) setShowSellerModal(false)
  }

  const handleSaveProduct = async (data) => {
    try {
      if (editingProduct) {
        const res = await marketplaceAPI.updateProduct(editingProduct.id, productToRequest(data))
        const updated = productFromResponse(unwrapOne(res))
        setListings((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)))
        toast.success(res.data?.message || 'Listing updated')
      } else {
        const res = await marketplaceAPI.createProduct(productToRequest(data))
        const created = productFromResponse(unwrapOne(res))
        setListings((prev) => [created, ...prev])
        toast.success(res.data?.message || 'Product submitted for approval')
      }
      setShowProductModal(false)
      setEditingProduct(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Remove this listing? This cannot be undone.')) return
    try {
      await marketplaceAPI.deleteProduct(id)
      setListings((prev) => prev.filter((p) => p.id !== id))
      toast.success('Listing removed')
    } catch (err) {
      toast.error(getApiErrorMessage(err, { 404: 'Product not found.' }))
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await marketplaceAPI.updateOrderStatus(orderId, status)
      toast.success(`Order marked as ${orderStatusLabel[status] || status}`)
      await load()
    } catch (err) {
      toast.error(getApiErrorMessage(err, { 404: 'Order not found.' }))
    }
  }

  const handleSaveAccount = async () => {
    if (!accountForm?.accountTitle?.trim() || !accountForm?.accountNumber?.trim()) {
      toast.error('Account title and number are required')
      return
    }

    try {
      const payload = {
        type: accountForm.type,
        accountTitle: accountForm.accountTitle.trim(),
        accountNumber: accountForm.accountNumber.trim(),
        bankName: accountForm.bankName?.trim() || undefined,
        iban: accountForm.iban?.trim() || undefined,
      }

      if (editingAccount) {
        await paymentAccountAPI.update(editingAccount.id, payload)
        toast.success('Payment account updated')
      } else {
        await paymentAccountAPI.create(payload)
        toast.success('Payment account added')
      }

      setAccountForm(null)
      setEditingAccount(null)
      await loadPayments()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleDeactivateAccount = async (id) => {
    if (!window.confirm('Deactivate this account? Buyers will no longer see it at checkout.')) return
    try {
      await paymentAccountAPI.deactivate(id)
      toast.success('Payment account deactivated')
      await loadPayments()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handlePaymentDecision = async (orderId, approve) => {
    try {
      if (approve) {
        await paymentAPI.approve(orderId)
        toast.success('Payment approved')
      } else {
        const reason = window.prompt('Why are you rejecting this payment? (optional)') || ''
        await paymentAPI.reject(orderId, reason)
        toast.success('Payment rejected')
      }
      await Promise.all([loadPayments(), load()])
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  // ---------------- gates ----------------
  if (!statusChecked) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <RefreshCw size={28} className="mx-auto text-gray-300 mb-4 animate-spin" />
        <p className="text-sm text-gray-400">Checking your seller status…</p>
      </div>
    )
  }

  const sellerStatus = (user?.sellerProfile?.status || '').toUpperCase()

  if (!isSeller) {
    if (sellerStatus === 'PENDING') {
      return (
        <div className="max-w-md mx-auto py-16 text-center">
          <Clock size={40} className="mx-auto text-amber-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-800">
            Your seller application is pending review
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {user.sellerProfile.shopName ? `"${user.sellerProfile.shopName}" is` : 'Your application is'}{' '}
            waiting for an admin to approve it. You&apos;ll be able to list products as soon as
            it&apos;s approved.
          </p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={async () => {
              setStatusChecked(false)
              await fetchMySellerProfile()
              setStatusChecked(true)
            }}
          >
            <RefreshCw size={15} /> Check again
          </Button>
        </div>
      )
    }

    if (sellerStatus === 'REJECTED') {
      return (
        <div className="max-w-md mx-auto py-16 text-center">
          <XCircle size={40} className="mx-auto text-danger mb-4" />
          <h2 className="text-lg font-semibold text-gray-800">
            Your seller application wasn&apos;t approved
          </h2>
          {user.sellerProfile.moderationReason && (
            <p className="text-sm text-gray-500 mt-2">Reason: {user.sellerProfile.moderationReason}</p>
          )}
          <Button variant="primary" className="mt-5" onClick={() => setShowSellerModal(true)}>
            Apply again
          </Button>
          {showSellerModal && (
            <BecomeSellerModal onClose={() => setShowSellerModal(false)} onSubmit={handleBecomeSeller} />
          )}
        </div>
      )
    }

    if (sellerStatus === 'SUSPENDED') {
      return (
        <div className="max-w-md mx-auto py-16 text-center">
          <ShieldAlert size={40} className="mx-auto text-danger mb-4" />
          <h2 className="text-lg font-semibold text-gray-800">Your seller account is suspended</h2>
          <p className="text-sm text-gray-500 mt-2">
            {user.sellerProfile.moderationReason ||
              'Contact support to find out more about this suspension.'}
          </p>
        </div>
      )
    }

    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <Store size={40} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800">
          You&apos;re not registered as a seller yet
        </h2>
        <p className="text-sm text-gray-500 mt-2 mb-5">
          Set up a seller profile to start listing products on the marketplace.
        </p>
        <Button variant="primary" onClick={() => setShowSellerModal(true)}>
          Become a Seller
        </Button>
        {showSellerModal && (
          <BecomeSellerModal onClose={() => setShowSellerModal(false)} onSubmit={handleBecomeSeller} />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-1.5">
            Seller Dashboard
            {user?.sellerProfile?.verified && (
              <span title="Verified seller">
                <ShieldCheck size={16} className="text-primary" />
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500">{user?.sellerProfile?.shopName || 'Your store'}</p>
        </div>

        {user?.sellerProfile?.id && (
          <button
            onClick={() => navigate(`/marketplace/seller/${user.sellerProfile.id}`)}
            className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            View public storefront
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={Package} color="primary" label="Total Products" value={listings.length} />
            <StatCard icon={CheckCircle2} color="success" label="Active Products" value={activeListings} />
            <StatCard icon={ClipboardList} color="secondary" label="Total Orders" value={orders.length} />
            <StatCard icon={Clock} color="warning" label="Pending Orders" value={pendingOrders} />
            <StatCard icon={Truck} color="info" label="Delivered Orders" value={deliveredOrders} />
            <StatCard icon={TrendingUp} color="success" label="Total Sales" value={formatPKR(totalSales)} />
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 gap-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              <TabButton active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon={LayoutDashboard} label="Dashboard" />
              <TabButton active={tab === 'listings'} onClick={() => setTab('listings')} icon={Package} label="Products" />
              <TabButton active={tab === 'orders'} onClick={() => setTab('orders')} icon={ClipboardList} label="Orders" />
              <TabButton active={tab === 'payments'} onClick={() => setTab('payments')} icon={CreditCard} label="Payment Details" />
              <TabButton active={tab === 'settings'} onClick={() => setTab('settings')} icon={Settings2} label="Store Settings" />
            </div>
            <Button
              size="sm"
              variant="primary"
              className="mb-2 shrink-0 flex items-center gap-1"
              onClick={() => {
                setEditingProduct(null)
                setShowProductModal(true)
              }}
            >
              <Plus size={16} /> Add Product
            </Button>
          </div>

          {/* ---------------- Dashboard ---------------- */}
          {tab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <h3 className="font-semibold text-gray-800 text-sm mb-3">Recent Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-400">No orders yet.</p>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800">{o.displayId}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(o.orderDateTime || o.orderDate)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-primary">{formatPKR(o.totalAmount)}</p>
                          <span className={`badge ${orderStatusColor[o.status] || 'badge-info'} text-[10px]`}>
                            {orderStatusLabel[o.status] || o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setTab('orders')}>
                  View all orders
                </Button>
              </Card>

              <Card>
                <h3 className="font-semibold text-gray-800 text-sm mb-3">Store Health</h3>
                <div className="space-y-2 text-sm">
                  <Row label="Average rating" value={avgRating != null ? `${avgRating.toFixed(1)} / 5` : '—'} />
                  <Row label={<span className="flex items-center gap-1"><Users size={12} /> Unique customers</span>} value={uniqueCustomers} />
                  <Row label="Revenue (excl. cancelled)" value={formatPKR(totalRevenue)} />
                  <Row label="Out-of-stock listings" value={listings.filter((p) => p.stock <= 0).length} />
                  <Row label="Awaiting approval" value={listings.filter((p) => p.status === 'PENDING_APPROVAL').length} />
                </div>
              </Card>
            </div>
          )}

          {/* ---------------- Products ---------------- */}
          {tab === 'listings' &&
            (listings.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No listings yet"
                subtitle="Publish your first product to start selling."
                action={
                  <Button variant="primary" className="mt-4" onClick={() => setShowProductModal(true)}>
                    Add Product
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((p) => (
                  <Card key={p.id} className="!p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          p.image
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-800 truncate">{p.title}</p>
                          {p.status && (
                            <span className={`badge ${productStatusColor[p.status] || 'badge-info'} text-[10px] shrink-0`}>
                              {productStatusLabel[p.status] || p.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Star size={11} className="text-secondary fill-secondary" />{' '}
                          {(p.rating ?? 0).toFixed(1)} ({p.reviewsCount})
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          {formatPKR(p.price)} / {p.unit}
                        </p>
                        <p className="text-xs text-gray-400">
                          {p.stock} {p.unit} in stock
                          {p.stock <= 5 && p.stock > 0 ? ' — low stock' : ''}
                        </p>
                        {(p.status === 'REJECTED' || p.status === 'SUSPENDED') && p.moderationReason && (
                          <p className="text-xs text-danger mt-1">{p.moderationReason}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          setEditingProduct(p)
                          setShowProductModal(true)
                        }}
                        className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-red-200 text-danger rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ))}

          {/* ---------------- Orders ---------------- */}
          {tab === 'orders' &&
            (orders.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No orders yet"
                subtitle="Orders from buyers will show up here."
              />
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button
                        className="text-left flex-1 min-w-0"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800">{order.displayId}</p>
                          <span className={`badge ${orderStatusColor[order.status] || 'badge-info'}`}>
                            {orderStatusLabel[order.status] || order.status}
                          </span>
                          {order.paymentStatus && (
                            <span className={`badge ${paymentStatusColor[order.paymentStatus] || 'badge-info'}`}>
                              {paymentStatusLabel[order.paymentStatus] || order.paymentStatus}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
                          {order.buyerName || `Buyer #${order.buyerId}`}
                          <span className="text-gray-300">•</span>
                          {formatDate(order.orderDateTime || order.orderDate)}
                          {order.paymentMethod && (
                            <>
                              <span className="text-gray-300">•</span>
                              {paymentMethodLabel[order.paymentMethod] || order.paymentMethod}
                            </>
                          )}
                        </p>

                        <ul className="text-sm text-gray-600 mt-2 space-y-0.5">
                          {order.items.map((it) => (
                            <li key={it.productId}>
                              {it.qty} {it.unit} × {it.title}
                            </li>
                          ))}
                        </ul>
                      </button>

                      <div className="text-left sm:text-right shrink-0">
                        <p className="font-bold text-primary text-lg">{formatPKR(order.totalAmount)}</p>
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <select
                            className="input-field mt-2 text-xs py-1"
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          >
                            {sellerAssignableStatuses.map((s) => (
                              <option key={s} value={s}>
                                {orderStatusLabel[s] || s}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="border-t mt-3 pt-3 space-y-2">
                        <OrderTimeline status={order.status} />
                        {order.deliveryAddress && (
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Deliver to:</span> {order.deliveryAddress}
                            {order.phone ? ` · ${order.phone}` : ''}
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ))}

          {/* ---------------- Payment Details ---------------- */}
          {tab === 'payments' && (
            <div className="space-y-4">
              <Card>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <CreditCard size={15} /> Your Receiving Accounts
                  </h3>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setEditingAccount(null)
                      setAccountForm({
                        type: 'EASYPAISA',
                        accountTitle: '',
                        accountNumber: '',
                        bankName: '',
                        iban: '',
                      })
                    }}
                  >
                    <Plus size={14} /> Add Account
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  These are shown to buyers who pick EasyPaisa, JazzCash or Bank Transfer at
                  checkout. SmartAgri never processes the payment — buyers transfer directly to you
                  and you verify it below.
                </p>

                {accountsLoading ? (
                  <p className="text-sm text-gray-400">Loading…</p>
                ) : accounts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No accounts yet. Buyers can still order with Cash on Delivery.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {accounts.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-start justify-between gap-3 border border-gray-200 rounded-lg p-3"
                      >
                        <div className="text-sm min-w-0">
                          <p className="font-medium text-gray-800">
                            {paymentMethodLabel[a.type] || a.type}
                            {!a.active && (
                              <span className="badge badge-danger ml-2 text-[10px]">Inactive</span>
                            )}
                          </p>
                          <p className="text-gray-600">{a.accountTitle}</p>
                          <p className="text-gray-500 font-mono text-xs">{a.accountNumber}</p>
                          {a.bankName && <p className="text-gray-500 text-xs">{a.bankName}</p>}
                          {a.iban && <p className="text-gray-500 text-xs font-mono">IBAN: {a.iban}</p>}
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingAccount(a)
                              setAccountForm({
                                type: a.type,
                                accountTitle: a.accountTitle || '',
                                accountNumber: a.accountNumber || '',
                                bankName: a.bankName || '',
                                iban: a.iban || '',
                              })
                            }}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                          {a.active && (
                            <button
                              onClick={() => handleDeactivateAccount(a.id)}
                              className="p-1.5 rounded-lg border border-red-200 text-danger hover:bg-red-50"
                              title="Deactivate"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {accountForm && (
                  <div className="mt-4 border-t pt-4 space-y-3">
                    <p className="text-sm font-medium text-gray-800">
                      {editingAccount ? 'Edit account' : 'New account'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <select
                          className="input-field mt-1"
                          value={accountForm.type}
                          onChange={(e) => setAccountForm({ ...accountForm, type: e.target.value })}
                        >
                          {paymentAccountTypes.map((t) => (
                            <option key={t} value={t}>
                              {paymentMethodLabel[t] || t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <AccountField
                        label="Account Title"
                        required
                        value={accountForm.accountTitle}
                        onChange={(v) => setAccountForm({ ...accountForm, accountTitle: v })}
                      />
                      <AccountField
                        label="Account / Mobile Number"
                        required
                        value={accountForm.accountNumber}
                        onChange={(v) => setAccountForm({ ...accountForm, accountNumber: v })}
                      />

                      {accountForm.type === 'BANK_TRANSFER' && (
                        <>
                          <AccountField
                            label="Bank Name"
                            value={accountForm.bankName}
                            onChange={(v) => setAccountForm({ ...accountForm, bankName: v })}
                          />
                          <AccountField
                            label="IBAN"
                            value={accountForm.iban}
                            onChange={(v) => setAccountForm({ ...accountForm, iban: v })}
                          />
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setAccountForm(null)
                          setEditingAccount(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" onClick={handleSaveAccount}>
                        {editingAccount ? 'Save Changes' : 'Add Account'}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              <Card>
                <h3 className="font-semibold text-gray-800 text-sm mb-3">
                  Transfers Awaiting Your Verification
                </h3>

                {accountsLoading ? (
                  <p className="text-sm text-gray-400">Loading…</p>
                ) : pendingPayments.length === 0 ? (
                  <p className="text-sm text-gray-500">Nothing waiting for review.</p>
                ) : (
                  <div className="space-y-2">
                    {pendingPayments.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-start justify-between gap-3 border border-gray-200 rounded-lg p-3"
                      >
                        <div className="text-sm min-w-0">
                          <p className="font-medium text-gray-800">ORD-{p.orderId}</p>
                          <p className="text-xs text-gray-500">
                            {paymentMethodLabel[p.method] || p.method} ·{' '}
                            {formatPKR(p.paidAmount ?? p.amount)}
                          </p>
                          {p.transactionReference && (
                            <p className="text-xs text-gray-500 font-mono">
                              TID: {p.transactionReference}
                            </p>
                          )}
                          {p.paymentProofUrl && (
                            <a
                              href={p.paymentProofUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              View receipt
                            </a>
                          )}
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handlePaymentDecision(p.orderId, true)}
                            className="p-1.5 rounded-lg border border-green-200 text-success hover:bg-green-50"
                            title="Approve"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handlePaymentDecision(p.orderId, false)}
                            className="p-1.5 rounded-lg border border-red-200 text-danger hover:bg-red-50"
                            title="Reject"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ---------------- Store Settings ---------------- */}
          {tab === 'settings' && (
            <Card className="max-w-2xl">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-3">
                <Settings2 size={15} /> Store Settings
              </h3>

              <div className="space-y-2 text-sm">
                <Row label="Store name" value={user?.sellerProfile?.shopName || '—'} />
                <Row label="Seller type" value={user?.sellerProfile?.sellerType || '—'} />
                <Row label="Status" value={user?.sellerProfile?.status || '—'} />
                <Row label="Verified" value={user?.sellerProfile?.verified ? 'Yes' : 'Not yet verified'} />
                <Row label="Description" value={user?.sellerProfile?.description || '—'} />
                <Row
                  label={<span className="flex items-center gap-1"><MapPin size={12} /> Location</span>}
                  value={user?.sellerProfile?.location || user?.location || '—'}
                />
                <Row
                  label={<span className="flex items-center gap-1"><Phone size={12} /> Phone</span>}
                  value={user?.sellerProfile?.phone || user?.phone || '—'}
                />
                <Row
                  label={<span className="flex items-center gap-1"><Mail size={12} /> Email</span>}
                  value={user?.sellerProfile?.email || user?.email || '—'}
                />
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Store details are managed by the marketplace service and cannot be edited here yet —
                the backend has no seller-profile update endpoint.
              </p>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await fetchMySellerProfile()
                    toast.success('Store details refreshed')
                  }}
                >
                  <RefreshCw size={14} /> Refresh
                </Button>
                {user?.sellerProfile?.id && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/marketplace/seller/${user.sellerProfile.id}`)}
                  >
                    View storefront
                  </Button>
                )}
              </div>
            </Card>
          )}
        </>
      )}

      {showProductModal && (
        <ProductFormModal
          initialData={editingProduct}
          onClose={() => {
            setShowProductModal(false)
            setEditingProduct(null)
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  )
}

// Tailwind's JIT needs literal class names, not `bg-${color}/10`.
const statColorClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
}

function StatCard({ icon: Icon, color, label, value }) {
  return (
    <Card className="flex items-center gap-3">
      <div className={`p-3 rounded-full ${statColorClasses[color] || statColorClasses.primary}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p className="text-xl font-bold truncate">{value}</p>
      </div>
    </Card>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 last:border-0 py-1.5">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium text-right break-words">{value}</span>
    </div>
  )
}

function AccountField({ label, value, onChange, required = false }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input className="input-field mt-1" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  )
}
