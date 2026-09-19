// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { ChevronLeft, ClipboardList, Store, ChevronRight } from 'lucide-react'
// import Card from '../components/common/Card'
// import Button from '../components/common/Button'
// import { SkeletonCard } from '../components/common/Skeleton'
// import { marketplaceAPI } from '../services/api'
// import { orderFromResponse } from '../utils/marketplaceMapper'
// import {
//   orderStatusColor,
//   paymentMethodLabel,
//   paymentStatusColor,
//   paymentStatusLabel,
// } from '../utils/constants'
// import { formatPKR, formatDate } from '../utils/format'
// import { getApiErrorMessage } from '../utils/apiError'
// import { EmptyState, ErrorState } from './Marketplace'

// const TABS = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

// export default function MyOrders() {
//   const navigate = useNavigate()

//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [tab, setTab] = useState('All')

//   const load = async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       const res = await marketplaceAPI.getMyOrders()
//       const raw = res.data?.data ?? res.data?.content ?? res.data ?? []
//       const list = (Array.isArray(raw) ? raw : []).map(orderFromResponse)

//       setOrders(
//         list.sort(
//           (a, b) =>
//             new Date(b.orderDateTime || b.orderDate) - new Date(a.orderDateTime || a.orderDate)
//         )
//       )
//     } catch (err) {
//       setError(getApiErrorMessage(err, { 404: 'No orders found.' }))
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     load()
//   }, [])

//   const filtered = useMemo(
//     () => (tab === 'All' ? orders : orders.filter((o) => o.status === tab)),
//     [orders, tab]
//   )

//   return (
//     <div className="space-y-5">
//       <button
//         onClick={() => navigate('/marketplace')}
//         className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
//       >
//         <ChevronLeft size={16} /> Back to Marketplace
//       </button>

//       <h1 className="text-xl font-bold text-gray-800">My Orders</h1>

//       <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200">
//         {TABS.map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
//               tab === t
//                 ? 'border-primary text-primary'
//                 : 'border-transparent text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="space-y-3">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <SkeletonCard key={i} />
//           ))}
//         </div>
//       ) : error ? (
//         <ErrorState message={error} onRetry={load} />
//       ) : orders.length === 0 ? (
//         <EmptyState
//           icon={ClipboardList}
//           title="You haven't placed any orders yet."
//           subtitle="Your purchases will show up here once you place an order."
//           action={
//             <Button variant="primary" className="mt-4" onClick={() => navigate('/marketplace')}>
//               Browse Products
//             </Button>
//           }
//         />
//       ) : filtered.length === 0 ? (
//         <EmptyState
//           icon={ClipboardList}
//           title="No orders here"
//           subtitle={`You have no ${tab.toLowerCase()} orders right now.`}
//           action={
//             <Button variant="outline" className="mt-4" onClick={() => setTab('All')}>
//               Show all orders
//             </Button>
//           }
//         />
//       ) : (
//         <div className="space-y-3">
//           {filtered.map((order) => (
//             <Card key={order.id}>
//               <button
//                 className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
//                 onClick={() => navigate(`/marketplace/orders/${order.id}`)}
//               >
//                 <div className="min-w-0">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <p className="font-semibold text-gray-800">{order.displayId}</p>
//                     <span className={`badge ${orderStatusColor[order.status] || 'badge-info'}`}>
//                       {order.status}
//                     </span>
//                     {order.paymentStatus && (
//                       <span
//                         className={`badge ${
//                           paymentStatusColor[order.paymentStatus] || 'badge-info'
//                         }`}
//                       >
//                         {paymentStatusLabel[order.paymentStatus] || order.paymentStatus}
//                       </span>
//                     )}
//                   </div>

//                   <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
//                     <Store size={11} /> {order.sellerName || 'Seller'}
//                     <span className="text-gray-300">•</span>
//                     {formatDate(order.orderDateTime || order.orderDate)}
//                     {order.paymentMethod && (
//                       <>
//                         <span className="text-gray-300">•</span>
//                         {paymentMethodLabel[order.paymentMethod] || order.paymentMethod}
//                       </>
//                     )}
//                   </p>

//                   <ul className="text-sm text-gray-600 mt-2 space-y-0.5">
//                     {order.items.map((it) => (
//                       <li key={it.productId}>
//                         {it.qty} {it.unit} × {it.title}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="flex items-center gap-2 shrink-0">
//                   <p className="font-bold text-primary text-lg">{formatPKR(order.totalAmount)}</p>
//                   <ChevronRight size={18} className="text-gray-300" />
//                 </div>
//               </button>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }


import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ClipboardList, Store, ChevronRight } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { SkeletonCard } from '../components/common/Skeleton'
import { marketplaceAPI } from '../services/api'
import { orderFromResponse, unwrapList } from '../utils/marketplaceMapper'
import {
  orderStatusColor,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusColor,
  paymentStatusLabel,
} from '../utils/constants'
import { formatPKR, formatDate } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'
import { EmptyState, ErrorState } from './Marketplace'

// Grouped tabs — the backend has 11 statuses, which is too many to show as tabs.
const TABS = [
  { id: 'ALL', label: 'All', matches: null },
  { id: 'PENDING', label: 'Pending', matches: ['PENDING'] },
  { id: 'ACTIVE', label: 'In Progress', matches: ['CONFIRMED', 'PROCESSING', 'READY_TO_SHIP'] },
  { id: 'SHIPPED', label: 'Shipped', matches: ['SHIPPED', 'OUT_FOR_DELIVERY'] },
  { id: 'DELIVERED', label: 'Delivered', matches: ['DELIVERED'] },
  {
    id: 'CLOSED',
    label: 'Cancelled / Returned',
    matches: ['CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED'],
  },
]

export default function MyOrders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('ALL')

  const load = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await marketplaceAPI.getMyOrders()
      const list = unwrapList(res).map(orderFromResponse)

      setOrders(
        list.sort(
          (a, b) =>
            new Date(b.orderDateTime || b.orderDate) - new Date(a.orderDateTime || a.orderDate)
        )
      )
    } catch (err) {
      setError(getApiErrorMessage(err, { 404: 'No orders found.' }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const active = TABS.find((t) => t.id === tab)
    if (!active?.matches) return orders
    return orders.filter((o) => active.matches.includes(o.status))
  }, [orders, tab])

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('/marketplace')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft size={16} /> Back to Marketplace
      </button>

      <h1 className="text-xl font-bold text-gray-800">My Orders</h1>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="You haven't placed any orders yet."
          subtitle="Your purchases will show up here once you place an order."
          action={
            <Button variant="primary" className="mt-4" onClick={() => navigate('/marketplace')}>
              Browse Products
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders here"
          subtitle="There are no orders in this category right now."
          action={
            <Button variant="outline" className="mt-4" onClick={() => setTab('ALL')}>
              Show all orders
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Card key={order.id}>
              <button
                className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                onClick={() => navigate(`/marketplace/orders/${order.id}`)}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-800">{order.displayId}</p>
                    <span className={`badge ${orderStatusColor[order.status] || 'badge-info'}`}>
                      {orderStatusLabel[order.status] || order.status}
                    </span>
                    {order.paymentStatus && (
                      <span
                        className={`badge ${
                          paymentStatusColor[order.paymentStatus] || 'badge-info'
                        }`}
                      >
                        {paymentStatusLabel[order.paymentStatus] || order.paymentStatus}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
                    <Store size={11} /> {order.sellerName || 'Seller'}
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
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <p className="font-bold text-primary text-lg">{formatPKR(order.totalAmount)}</p>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
