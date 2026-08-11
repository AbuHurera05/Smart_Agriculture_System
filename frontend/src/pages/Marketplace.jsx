import { useMemo, useState } from 'react'
import {
  Search, ShoppingCart, Store, Package, ClipboardList, Plus,
  Trash2, Pencil, Minus, Star, TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import ProductCard from '../components/marketplace/ProductCard'
import ProductFormModal from '../components/marketplace/ProductFormModal'
import BecomeSellerModal from '../components/marketplace/BecomeSellerModal'
import useStore from '../store/useStore'
import { useAuthContext } from '../context/AuthContext'
import { productCategories, orderStatusColor } from '../utils/constants'

// ---------------------------------------------------------------------------
// Seed / mock catalogue. In production this list is fetched from
// marketplaceAPI.getProducts() (Spring Boot: GET /api/marketplace/products)
// ---------------------------------------------------------------------------
const seedProducts = [
  { id: 'p1', sellerId: 2, sellerName: 'John Farmer', sellerLocation: 'Punjab, India', sellerVerified: true, title: 'Premium Basmati Rice', description: 'Freshly harvested long-grain basmati rice, sun-dried and cleaned.', category: 'produce', price: 85, unit: 'kg', stock: 500, rating: 4.7, reviewsCount: 34, organic: true, negotiable: true, image: '🌾' },
  { id: 'p2', sellerId: 4, sellerName: 'Green Valley Farms', sellerLocation: 'Nashik, Maharashtra', sellerVerified: true, title: 'Hybrid Tomato Seeds (Pack of 100)', description: 'High-yield disease-resistant hybrid tomato seeds.', category: 'seeds', price: 250, unit: 'piece', stock: 120, rating: 4.5, reviewsCount: 21, organic: false, negotiable: false, image: '🌱' },
  { id: 'p3', sellerId: 5, sellerName: 'AgroTech Supplies', sellerLocation: 'Ludhiana, Punjab', sellerVerified: false, title: 'Organic Vermicompost Fertilizer', description: '100% organic vermicompost, improves soil fertility naturally.', category: 'fertilizers', price: 18, unit: 'kg', stock: 2000, rating: 4.3, reviewsCount: 58, organic: true, negotiable: true, image: '🧪' },
  { id: 'p4', sellerId: 6, sellerName: 'Sunrise Equipment Co.', sellerLocation: 'Ahmedabad, Gujarat', sellerVerified: true, title: 'Mini Power Tiller 7HP', description: 'Compact and fuel-efficient power tiller ideal for small farms.', category: 'equipment', price: 45000, unit: 'piece', stock: 8, rating: 4.8, reviewsCount: 12, organic: false, negotiable: true, image: '🚜' },
  { id: 'p5', sellerId: 2, sellerName: 'John Farmer', sellerLocation: 'Punjab, India', sellerVerified: true, title: 'Fresh Wheat Grain', description: 'Golden wheat grain, harvested this season, ready for milling.', category: 'produce', price: 32, unit: 'kg', stock: 1500, rating: 4.6, reviewsCount: 47, organic: false, negotiable: false, image: '🌾' },
  { id: 'p6', sellerId: 7, sellerName: 'FarmTools India', sellerLocation: 'Pune, Maharashtra', sellerVerified: true, title: 'Stainless Steel Sickle Set', description: 'Durable rust-resistant sickle set of 3, ergonomic handles.', category: 'tools', price: 650, unit: 'piece', stock: 60, rating: 4.4, reviewsCount: 19, organic: false, negotiable: false, image: '🛠️' },
  { id: 'p7', sellerId: 8, sellerName: 'Happy Cow Dairy', sellerLocation: 'Anand, Gujarat', sellerVerified: true, title: 'Pure A2 Cow Milk', description: 'Farm-fresh A2 milk delivered daily, no preservatives.', category: 'livestock', price: 70, unit: 'liter', stock: 300, rating: 4.9, reviewsCount: 76, organic: true, negotiable: false, image: '🐄' },
  { id: 'p8', sellerId: 4, sellerName: 'Green Valley Farms', sellerLocation: 'Nashik, Maharashtra', sellerVerified: true, title: 'Organic Onion Seeds', description: 'Certified organic onion seeds with 90%+ germination rate.', category: 'seeds', price: 180, unit: 'kg', stock: 45, rating: 4.2, reviewsCount: 9, organic: true, negotiable: true, image: '🌱' },
]

const seedOrders = [
  { id: 'ORD-1001', buyerId: 1, buyerName: 'Admin User', sellerId: 2, sellerName: 'John Farmer', items: [{ productId: 'p1', title: 'Premium Basmati Rice', qty: 20, unit: 'kg', price: 85 }], totalAmount: 1700, status: 'Delivered', orderDate: '2026-07-10' },
  { id: 'ORD-1002', buyerId: 3, buyerName: 'Dr. Sarah Wilson', sellerId: 4, sellerName: 'Green Valley Farms', items: [{ productId: 'p2', title: 'Hybrid Tomato Seeds (Pack of 100)', qty: 5, unit: 'piece', price: 250 }], totalAmount: 1250, status: 'Shipped', orderDate: '2026-07-18' },
]

export default function Marketplace() {
  const { user, isSeller, becomeSeller } = useAuthContext()
  const { cartItems, addToCart, updateCartQty, removeFromCart, clearCart } = useStore()

  const [mode, setMode] = useState('buy') // 'buy' | 'sell'
  const [buyTab, setBuyTab] = useState('browse') // browse | cart | orders
  const [sellTab, setSellTab] = useState('listings') // listings | orders

  const [products, setProducts] = useState(seedProducts)
  const [orders, setOrders] = useState(seedOrders)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const [showSellerModal, setShowSellerModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || p.category === category
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const myListings = useMemo(
    () => products.filter((p) => p.sellerId === user?.id),
    [products, user]
  )

  const myOrders = useMemo(
    () => orders.filter((o) => o.buyerId === user?.id),
    [orders, user]
  )

  const ordersReceived = useMemo(
    () => orders.filter((o) => o.sellerId === user?.id),
    [orders, user]
  )

  const cartTotal = cartItems.reduce((sum, c) => sum + c.price * c.qty, 0)

  // ---- Handlers ----
  const handleAddToCart = (product) => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      unit: product.unit,
      qty: 1,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      image: product.image,
      stock: product.stock,
    })
    toast.success(`${product.title} added to cart`)
  }

  const handleBecomeSeller = async (data) => {
    const res = await becomeSeller(data)
    if (res.success) {
      setShowSellerModal(false)
      setMode('sell')
    }
  }

  const handleSaveProduct = (data) => {
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, ...data } : p))
      toast.success('Listing updated')
    } else {
      const newProduct = {
        ...data,
        id: `p${Date.now()}`,
        sellerId: user.id,
        sellerName: user?.sellerProfile?.shopName || user.name,
        sellerLocation: user?.sellerProfile?.location || user.location || 'Unknown',
        sellerVerified: !!user?.sellerProfile?.verified,
        rating: 0,
        reviewsCount: 0,
      }
      setProducts((prev) => [newProduct, ...prev])
      toast.success('Product listed on the marketplace!')
    }
    setShowProductModal(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast.success('Listing removed')
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    const groupedBySeller = cartItems.reduce((acc, item) => {
      acc[item.sellerId] = acc[item.sellerId] || []
      acc[item.sellerId].push(item)
      return acc
    }, {})

    const newOrders = Object.entries(groupedBySeller).map(([sellerId, items], idx) => ({
      id: `ORD-${Date.now()}${idx}`,
      buyerId: user.id,
      buyerName: user.name,
      sellerId: Number(sellerId),
      sellerName: items[0].sellerName,
      items: items.map((i) => ({ productId: i.productId, title: i.title, qty: i.qty, unit: i.unit, price: i.price })),
      totalAmount: items.reduce((s, i) => s + i.price * i.qty, 0),
      status: 'Pending',
      orderDate: new Date().toISOString().split('T')[0],
    }))

    setOrders((prev) => [...newOrders, ...prev])
    clearCart()
    setBuyTab('orders')
    toast.success('Order placed successfully!')
  }

  const handleUpdateOrderStatus = (orderId, status) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
    toast.success(`Order ${orderId} marked as ${status}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
          <p className="text-gray-500 text-sm mt-1">
            Buy and sell farm produce, seeds, equipment and supplies directly with the community.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setMode('buy')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${mode === 'buy' ? 'bg-white shadow text-primary' : 'text-gray-600'}`}
          >
            <ShoppingCart size={16} /> Buying
          </button>
          <button
            onClick={() => isSeller ? setMode('sell') : setShowSellerModal(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${mode === 'sell' ? 'bg-white shadow text-primary' : 'text-gray-600'}`}
          >
            <Store size={16} /> {isSeller ? 'Selling' : 'Become a Seller'}
          </button>
        </div>
      </div>

      {mode === 'buy' ? (
        <BuyerView
          buyTab={buyTab}
          setBuyTab={setBuyTab}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          filteredProducts={filteredProducts}
          onAddToCart={handleAddToCart}
          cartItems={cartItems}
          updateCartQty={updateCartQty}
          removeFromCart={removeFromCart}
          cartTotal={cartTotal}
          handleCheckout={handleCheckout}
          myOrders={myOrders}
        />
      ) : (
        <SellerView
          sellTab={sellTab}
          setSellTab={setSellTab}
          myListings={myListings}
          ordersReceived={ordersReceived}
          onAddProduct={() => { setEditingProduct(null); setShowProductModal(true) }}
          onEditProduct={(p) => { setEditingProduct(p); setShowProductModal(true) }}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {showSellerModal && (
        <BecomeSellerModal onClose={() => setShowSellerModal(false)} onSubmit={handleBecomeSeller} />
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

// ---------------------------------------------------------------------------
// Buyer view: Browse / Cart / Orders
// ---------------------------------------------------------------------------
function BuyerView({
  buyTab, setBuyTab, search, setSearch, category, setCategory,
  filteredProducts, onAddToCart, cartItems, updateCartQty, removeFromCart,
  cartTotal, handleCheckout, myOrders,
}) {
  return (
    <div>
      <div className="flex items-center gap-1 border-b border-gray-200 mb-5">
        <TabButton active={buyTab === 'browse'} onClick={() => setBuyTab('browse')} icon={Search} label="Browse" />
        <TabButton active={buyTab === 'cart'} onClick={() => setBuyTab('cart')} icon={ShoppingCart} label={`Cart (${cartItems.length})`} />
        <TabButton active={buyTab === 'orders'} onClick={() => setBuyTab('orders')} icon={ClipboardList} label="My Orders" />
      </div>

      {buyTab === 'browse' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, e.g. rice, seeds, tractor..."
                className="flex-1 outline-none px-2 text-sm bg-transparent"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field sm:w-56"
            >
              <option value="all">All Categories</option>
              {productCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <EmptyState icon={Package} title="No products found" subtitle="Try a different search term or category." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
              ))}
            </div>
          )}
        </div>
      )}

      {buyTab === 'cart' && (
        <CartView
          cartItems={cartItems}
          updateCartQty={updateCartQty}
          removeFromCart={removeFromCart}
          cartTotal={cartTotal}
          handleCheckout={handleCheckout}
        />
      )}

      {buyTab === 'orders' && <OrdersList orders={myOrders} viewAs="buyer" />}
    </div>
  )
}

function CartView({ cartItems, updateCartQty, removeFromCart, cartTotal, handleCheckout }) {
  if (cartItems.length === 0) {
    return <EmptyState icon={ShoppingCart} title="Your cart is empty" subtitle="Browse the marketplace and add products to get started." />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-3">
        {cartItems.map((item) => (
          <Card key={item.productId} className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0">
              {item.image}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{item.title}</p>
              <p className="text-xs text-gray-500">Sold by {item.sellerName}</p>
              <p className="text-sm font-semibold text-primary mt-1">₹{item.price} / {item.unit}</p>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
              <button onClick={() => updateCartQty(item.productId, item.qty - 1)} className="p-2 hover:bg-gray-100 rounded-l-lg">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm">{item.qty}</span>
              <button onClick={() => updateCartQty(item.productId, item.qty + 1)} className="p-2 hover:bg-gray-100 rounded-r-lg">
                <Plus size={14} />
              </button>
            </div>
            <button onClick={() => removeFromCart(item.productId)} className="p-2 text-danger hover:bg-red-50 rounded-lg">
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
      </div>

      <Card className="h-fit">
        <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Items ({cartItems.reduce((s, i) => s + i.qty, 0)})</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Delivery</span>
            <span className="text-success">Free</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold text-gray-800">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
        </div>
        <Button variant="primary" className="w-full mt-4" onClick={handleCheckout}>
          Place Order
        </Button>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Orders are grouped by seller and sent for confirmation.
        </p>
      </Card>
    </div>
  )
}

function OrdersList({ orders, viewAs, onUpdateOrderStatus }) {
  if (orders.length === 0) {
    return <EmptyState icon={ClipboardList} title="No orders yet" subtitle={viewAs === 'buyer' ? 'Your purchases will show up here.' : 'Orders from buyers will show up here.'} />
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-800">{order.id}</p>
                <span className={`badge ${orderStatusColor[order.status] || 'badge-info'}`}>{order.status}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {viewAs === 'buyer' ? `Seller: ${order.sellerName}` : `Buyer: ${order.buyerName}`} • {order.orderDate}
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-0.5">
                {order.items.map((it) => (
                  <li key={it.productId}>{it.qty} {it.unit} × {it.title}</li>
                ))}
              </ul>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <p className="font-bold text-primary text-lg">₹{order.totalAmount.toLocaleString()}</p>
              {viewAs === 'seller' && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                <select
                  className="input-field mt-2 text-xs py-1"
                  value={order.status}
                  onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                >
                  {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Seller view: Listings / Orders Received
// ---------------------------------------------------------------------------
function SellerView({ sellTab, setSellTab, myListings, ordersReceived, onAddProduct, onEditProduct, onDeleteProduct, onUpdateOrderStatus }) {
  const totalSales = ordersReceived
    .filter((o) => o.status === 'Delivered')
    .reduce((s, o) => s + o.totalAmount, 0)
  const pendingOrders = ordersReceived.filter((o) => o.status === 'Pending').length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10 text-primary"><Package size={20} /></div>
          <div>
            <p className="text-xs text-gray-500">Active Listings</p>
            <p className="text-xl font-bold">{myListings.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-secondary/10 text-secondary"><ClipboardList size={20} /></div>
          <div>
            <p className="text-xs text-gray-500">Pending Orders</p>
            <p className="text-xl font-bold">{pendingOrders}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-success/10 text-success"><TrendingUp size={20} /></div>
          <div>
            <p className="text-xs text-gray-500">Total Sales (Delivered)</p>
            <p className="text-xl font-bold">₹{totalSales.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-1">
          <TabButton active={sellTab === 'listings'} onClick={() => setSellTab('listings')} icon={Package} label="My Listings" />
          <TabButton active={sellTab === 'orders'} onClick={() => setSellTab('orders')} icon={ClipboardList} label="Orders Received" />
        </div>
        {sellTab === 'listings' && (
          <Button size="sm" variant="primary" className="mb-2 flex items-center gap-1" onClick={onAddProduct}>
            <Plus size={16} /> New Listing
          </Button>
        )}
      </div>

      {sellTab === 'listings' && (
        myListings.length === 0 ? (
          <EmptyState icon={Package} title="No listings yet" subtitle="Publish your first product to start selling." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((p) => (
              <Card key={p.id} className="!p-4">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0">{p.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Star size={11} className="text-secondary fill-secondary" /> {p.rating.toFixed(1)} ({p.reviewsCount})
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">₹{p.price} / {p.unit}</p>
                    <p className="text-xs text-gray-400">{p.stock} {p.unit} in stock</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => onEditProduct(p)} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => onDeleteProduct(p.id)} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-red-200 text-danger rounded-lg hover:bg-red-50">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {sellTab === 'orders' && (
        <OrdersList orders={ordersReceived} viewAs="seller" onUpdateOrderStatus={onUpdateOrderStatus} />
      )}
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  )
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
      <Icon size={40} className="mb-3 opacity-50" />
      <p className="font-medium text-gray-600">{title}</p>
      <p className="text-sm mt-1">{subtitle}</p>
    </div>
  )
}
