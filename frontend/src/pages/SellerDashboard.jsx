import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, ClipboardList, TrendingUp, Plus, Pencil, Trash2, Star, Store, Users,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { SkeletonCard } from '../components/common/Skeleton'
import ProductFormModal from '../components/marketplace/ProductFormModal'
import BecomeSellerModal from '../components/marketplace/BecomeSellerModal'
import OrderTimeline from '../components/marketplace/OrderTimeline'
import { useAuthContext } from '../context/AuthContext'
import { marketplaceAPI } from '../services/api'
import { productFromResponse, productToRequest, orderFromResponse } from '../utils/marketplaceMapper'
import { orderStatuses, orderStatusColor } from '../utils/constants'
import { EmptyState, ErrorState } from './Marketplace'

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback

export default function SellerDashboard() {
  const navigate = useNavigate()
  const { user, isSeller, becomeSeller } = useAuthContext()

  const [tab, setTab] = useState('listings') // listings | orders
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showSellerModal, setShowSellerModal] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [listingsRes, ordersRes] = await Promise.all([
        marketplaceAPI.getMyListings(),
        marketplaceAPI.getSellerOrders(),
      ])
      setListings((listingsRes.data?.data ?? listingsRes.data ?? []).map(productFromResponse))
      setOrders((ordersRes.data?.data ?? ordersRes.data ?? []).map(orderFromResponse))
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your seller dashboard'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (isSeller) load() }, [isSeller])

  const totalSales = useMemo(
    () => orders.filter((o) => o.status === 'Delivered').reduce((s, o) => s + o.totalAmount, 0),
    [orders]
  )
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'Pending').length, [orders])
  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.totalAmount, 0),
    [orders]
  )
  const uniqueCustomers = useMemo(() => new Set(orders.map((o) => o.buyerId)).size, [orders])
  const avgRating = useMemo(() => {
    const rated = listings.filter((p) => p.reviewsCount > 0)
    if (!rated.length) return null
    return rated.reduce((s, p) => s + p.rating, 0) / rated.length
  }, [listings])

  const handleBecomeSeller = async (data) => {
    const res = await becomeSeller(data)
    if (res.success) setShowSellerModal(false)
  }

  const handleSaveProduct = async (data) => {
    try {
      if (editingProduct) {
        const res = await marketplaceAPI.updateProduct(editingProduct.id, productToRequest(data))
        const updated = productFromResponse(res.data?.data ?? res.data)
        setListings((prev) => prev.map((p) => p.id === editingProduct.id ? updated : p))
        toast.success('Listing updated')
      } else {
        const res = await marketplaceAPI.createProduct(productToRequest(data))
        const created = productFromResponse(res.data?.data ?? res.data)
        setListings((prev) => [created, ...prev])
        toast.success('Product listed on the marketplace!')
      }
      setShowProductModal(false)
      setEditingProduct(null)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save this listing'))
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Remove this listing? This cannot be undone.')) return
    try {
      await marketplaceAPI.deleteProduct(id)
      setListings((prev) => prev.filter((p) => p.id !== id))
      toast.success('Listing removed')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not remove this listing'))
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await marketplaceAPI.updateOrderStatus(orderId, status.toUpperCase())
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
      toast.success(`Order marked as ${status}`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update order status'))
    }
  }

  if (!isSeller) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <Store size={40} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800">You're not registered as a seller yet</h2>
        <p className="text-sm text-gray-500 mt-2 mb-5">Set up a seller profile to start listing products on the marketplace.</p>
        <Button variant="primary" onClick={() => setShowSellerModal(true)}>Become a Seller</Button>
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
          <h1 className="text-xl font-bold text-gray-800">Seller Dashboard</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard icon={Package} color="primary" label="Active Listings" value={listings.length} />
            <StatCard icon={ClipboardList} color="secondary" label="Pending Orders" value={pendingOrders} />
            <StatCard icon={TrendingUp} color="success" label="Sales (Delivered)" value={`₹${totalSales.toLocaleString()}`} />
            <StatCard icon={Users} color="info" label="Customers" value={uniqueCustomers} />
            <StatCard icon={Star} color="warning" label="Avg. Rating" value={avgRating != null ? avgRating.toFixed(1) : '—'} />
          </div>

          <div className="flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-1">
              <TabButton active={tab === 'listings'} onClick={() => setTab('listings')} icon={Package} label="Products" />
              <TabButton active={tab === 'orders'} onClick={() => setTab('orders')} icon={ClipboardList} label="Orders" />
            </div>
            {tab === 'listings' && (
              <Button size="sm" variant="primary" className="mb-2 flex items-center gap-1" onClick={() => { setEditingProduct(null); setShowProductModal(true) }}>
                <Plus size={16} /> New Listing
              </Button>
            )}
          </div>

          {tab === 'listings' && (
            listings.length === 0 ? (
              <EmptyState icon={Package} title="No listings yet" subtitle="Publish your first product to start selling."
                action={<Button variant="primary" className="mt-4" onClick={() => setShowProductModal(true)}>Add Product</Button>} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((p) => (
                  <Card key={p.id} className="!p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                        {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : p.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{p.title}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Star size={11} className="text-secondary fill-secondary" /> {p.rating.toFixed(1)} ({p.reviewsCount})
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1">₹{p.price.toLocaleString()} / {p.unit}</p>
                        <p className="text-xs text-gray-400">{p.stock} {p.unit} in stock{p.stock <= 5 && p.stock > 0 ? ' — low stock' : ''}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => { setEditingProduct(p); setShowProductModal(true) }} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-red-200 text-danger rounded-lg hover:bg-red-50">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}

          {tab === 'orders' && (
            orders.length === 0 ? (
              <EmptyState icon={ClipboardList} title="No orders yet" subtitle="Orders from buyers will show up here." />
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button className="text-left flex-1" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">{order.displayId}</p>
                          <span className={`badge ${orderStatusColor[order.status] || 'badge-info'}`}>{order.status}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Buyer #{order.buyerId} • {order.orderDate}</p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-0.5">
                          {order.items.map((it) => <li key={it.productId}>{it.qty} {it.unit} × {it.title}</li>)}
                        </ul>
                      </button>
                      <div className="text-left sm:text-right shrink-0">
                        <p className="font-bold text-primary text-lg">₹{order.totalAmount.toLocaleString()}</p>
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                          <select
                            className="input-field mt-2 text-xs py-1"
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          >
                            {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                      </div>
                    </div>
                    {expandedOrder === order.id && (
                      <div className="border-t mt-3 pt-3">
                        <OrderTimeline status={order.status} />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )
          )}
        </>
      )}

      {showProductModal && (
        <ProductFormModal
          initialData={editingProduct}
          onClose={() => { setShowProductModal(false); setEditingProduct(null) }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  )
}

// Static class map — Tailwind's JIT compiler needs literal class names,
// not interpolated ones like `bg-${color}/10`.
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
      <div className={`p-3 rounded-full ${statColorClasses[color] || statColorClasses.primary}`}><Icon size={20} /></div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p className="text-xl font-bold truncate">{value}</p>
      </div>
    </Card>
  )
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
    >
      <Icon size={16} /> {label}
    </button>
  )
}