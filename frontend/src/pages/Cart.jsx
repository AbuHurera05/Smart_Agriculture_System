import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ChevronLeft, Store } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useStore from '../store/useStore'
import { EmptyState } from './Marketplace'

export default function Cart() {
  const navigate = useNavigate()
  const { cartItems, updateCartQty, removeFromCart } = useStore()

  const cartTotal = cartItems.reduce((sum, c) => sum + c.price * c.qty, 0)

  const groupedBySeller = cartItems.reduce((acc, item) => {
    const key = item.sellerId ?? 'unknown'
    acc[key] = acc[key] || { sellerName: item.sellerName, items: [] }
    acc[key].items.push(item)
    return acc
  }, {})

  if (cartItems.length === 0) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/marketplace')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16} /> Back to Marketplace
        </button>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          subtitle="Browse the marketplace and add products to get started."
          action={<Button variant="primary" className="mt-4" onClick={() => navigate('/marketplace')}>Browse Products</Button>}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/marketplace')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft size={16} /> Continue Shopping
      </button>

      <h1 className="text-xl font-bold text-gray-800">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {Object.entries(groupedBySeller).map(([sellerId, group]) => (
            <div key={sellerId}>
              <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
                <Store size={13} /> Sold by {group.sellerName || 'Seller'}
              </p>
              <div className="space-y-3">
                {group.items.map((item) => {
                  const overStock = item.stock != null && item.qty > item.stock
                  return (
                    <Card key={item.productId} className="flex items-center gap-4 flex-wrap">
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                        {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : item.image}
                      </div>
                      <div className="flex-1 min-w-[140px]">
                        <p className="font-medium text-gray-800 truncate">{item.title}</p>
                        <p className="text-sm font-semibold text-primary mt-1">₹{item.price.toLocaleString()} / {item.unit}</p>
                        {overStock && (
                          <p className="text-xs text-danger mt-1">Only {item.stock} {item.unit} left in stock — reduce quantity.</p>
                        )}
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
                  )
                })}
              </div>
            </div>
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
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-gray-800">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>
          <Button variant="primary" className="w-full mt-4" onClick={() => navigate('/marketplace/checkout')}>
            Proceed to Checkout
          </Button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Orders are grouped by seller and sent for confirmation.
          </p>
        </Card>
      </div>
    </div>
  )
}