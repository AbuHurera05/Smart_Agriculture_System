import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ClipboardList, Store } from 'lucide-react'
import Card from '../components/common/Card'
import { SkeletonCard } from '../components/common/Skeleton'
import OrderTimeline from '../components/marketplace/OrderTimeline'
import { marketplaceAPI } from '../services/api'
import { orderFromResponse } from '../utils/marketplaceMapper'
import { orderStatusColor } from '../utils/constants'
import { EmptyState, ErrorState } from './Marketplace'

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback

const TABS = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

export default function MyOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await marketplaceAPI.getMyOrders()
      const list = (res.data?.data ?? res.data ?? []).map(orderFromResponse)
      setOrders(list.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)))
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your orders'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(
    () => tab === 'All' ? orders : orders.filter((o) => o.status === tab),
    [orders, tab]
  )

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/marketplace')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft size={16} /> Back to Marketplace
      </button>

      <h1 className="text-xl font-bold text-gray-800">My Orders</h1>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders here" subtitle="Your purchases will show up here once you place an order." />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Card key={order.id}>
              <button
                className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{order.displayId}</p>
                    <span className={`badge ${orderStatusColor[order.status] || 'badge-info'}`}>{order.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Store size={11} /> {order.sellerName} • {order.orderDate}
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-0.5">
                    {order.items.map((it) => (
                      <li key={it.productId}>{it.qty} {it.unit} × {it.title}</li>
                    ))}
                  </ul>
                </div>
                <p className="font-bold text-primary text-lg shrink-0">₹{order.totalAmount.toLocaleString()}</p>
              </button>

              {expanded === order.id && (
                <div className="border-t mt-3 pt-3">
                  <OrderTimeline status={order.status} />
                  {order.deliveryAddress && (
                    <p className="text-xs text-gray-500 mt-2"><span className="font-medium">Delivery address:</span> {order.deliveryAddress}</p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}