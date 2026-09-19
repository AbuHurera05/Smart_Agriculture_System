// import { useNavigate } from 'react-router-dom'
// import { ShoppingCart, Trash2, Plus, Minus, ChevronLeft, Store } from 'lucide-react'
// import Card from '../components/common/Card'
// import Button from '../components/common/Button'
// import useStore from '../store/useStore'
// import { formatPKR } from '../utils/format'
// import { EmptyState } from './Marketplace'

// export default function Cart() {
//   const navigate = useNavigate()
//   const { cartItems, updateCartQty, removeFromCart } = useStore()

//   const subtotal = cartItems.reduce((sum, c) => sum + c.price * c.qty, 0)

//   // The backend is the source of truth for delivery charges. Until it sends
//   // one back on the order, delivery is Rs. 0 and grand total === subtotal.
//   const delivery = 0
//   const grandTotal = subtotal + delivery

//   const itemCount = cartItems.reduce((s, i) => s + i.qty, 0)

//   const groupedBySeller = cartItems.reduce((acc, item) => {
//     const key = item.sellerId ?? 'unknown'
//     acc[key] = acc[key] || { sellerName: item.sellerName, items: [] }
//     acc[key].items.push(item)
//     return acc
//   }, {})

//   if (cartItems.length === 0) {
//     return (
//       <div className="space-y-4">
//         <button
//           onClick={() => navigate('/marketplace')}
//           className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
//         >
//           <ChevronLeft size={16} /> Back to Marketplace
//         </button>
//         <EmptyState
//           icon={ShoppingCart}
//           title="Your cart is empty"
//           subtitle="Browse the marketplace and add products to get started."
//           action={
//             <Button variant="primary" className="mt-4" onClick={() => navigate('/marketplace')}>
//               Continue Shopping
//             </Button>
//           }
//         />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-5">
//       <button
//         onClick={() => navigate('/marketplace')}
//         className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
//       >
//         <ChevronLeft size={16} /> Continue Shopping
//       </button>

//       <div className="flex items-baseline gap-2">
//         <h1 className="text-xl font-bold text-gray-800">Your Cart</h1>
//         <span className="text-sm text-gray-400">
//           {itemCount} {itemCount === 1 ? 'item' : 'items'}
//         </span>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         <div className="lg:col-span-2 space-y-5">
//           {Object.entries(groupedBySeller).map(([sellerId, group]) => (
//             <div key={sellerId}>
//               <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
//                 <Store size={13} /> Sold by {group.sellerName || 'Seller'}
//               </p>

//               <div className="space-y-3">
//                 {group.items.map((item) => {
//                   const overStock = item.stock != null && item.qty > item.stock
//                   const lineSubtotal = item.price * item.qty

//                   return (
//                     <Card key={item.productId} className="flex items-center gap-4 flex-wrap">
//                       <button
//                         onClick={() => navigate(`/marketplace/product/${item.productId}`)}
//                         className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden"
//                       >
//                         {item.imageUrl ? (
//                           <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
//                         ) : (
//                           item.image
//                         )}
//                       </button>

//                       <div className="flex-1 min-w-[140px]">
//                         <button
//                           onClick={() => navigate(`/marketplace/product/${item.productId}`)}
//                           className="font-medium text-gray-800 hover:text-primary text-left truncate block w-full"
//                         >
//                           {item.title}
//                         </button>
//                         <p className="text-sm text-gray-500 mt-0.5">
//                           {formatPKR(item.price)} / {item.unit}
//                         </p>
//                         {overStock && (
//                           <p className="text-xs text-danger mt-1">
//                             Only {item.stock} {item.unit} left in stock — reduce quantity.
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex items-center border border-gray-200 rounded-lg">
//                         <button
//                           onClick={() => updateCartQty(item.productId, item.qty - 1)}
//                           disabled={item.qty <= 1}
//                           className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-40 disabled:cursor-not-allowed"
//                         >
//                           <Minus size={14} />
//                         </button>
//                         <span className="w-10 text-center text-sm font-medium">{item.qty}</span>
//                         <button
//                           onClick={() => updateCartQty(item.productId, item.qty + 1)}
//                           disabled={item.stock != null && item.qty >= item.stock}
//                           className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-40 disabled:cursor-not-allowed"
//                         >
//                           <Plus size={14} />
//                         </button>
//                       </div>

//                       <div className="text-right min-w-[92px]">
//                         <p className="text-[11px] text-gray-400">Subtotal</p>
//                         <p className="font-semibold text-primary">{formatPKR(lineSubtotal)}</p>
//                       </div>

//                       <button
//                         onClick={() => removeFromCart(item.productId)}
//                         className="p-2 text-danger hover:bg-red-50 rounded-lg"
//                         title="Remove from cart"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </Card>
//                   )
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>

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
//               <span>Grand Total</span>
//               <span className="text-primary">{formatPKR(grandTotal)}</span>
//             </div>
//           </div>

//           <Button
//             variant="primary"
//             className="w-full mt-4"
//             onClick={() => navigate('/marketplace/checkout')}
//           >
//             Proceed to Checkout
//           </Button>

//           <p className="text-xs text-gray-400 mt-2 text-center">
//             The final amount is calculated and confirmed by the seller when the order is created.
//           </p>
//         </Card>
//       </div>
//     </div>
//   )
// }

import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ChevronLeft, Store } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useStore from '../store/useStore'
import { formatPKR } from '../utils/format'
import { EmptyState } from './Marketplace'

export default function Cart() {
  const navigate = useNavigate()
  const { cartItems, updateCartQty, removeFromCart } = useStore()

  const subtotal = cartItems.reduce((sum, c) => sum + c.price * c.qty, 0)

  // marketplace-service adds its own delivery charge (and applies any coupon)
  // when the order is created, so the cart can only show the item subtotal.
  // The authoritative total comes back on the order.

  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0)

  const groupedBySeller = cartItems.reduce((acc, item) => {
    const key = item.sellerId ?? 'unknown'
    acc[key] = acc[key] || { sellerName: item.sellerName, items: [] }
    acc[key].items.push(item)
    return acc
  }, {})

  if (cartItems.length === 0) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft size={16} /> Back to Marketplace
        </button>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          subtitle="Browse the marketplace and add products to get started."
          action={
            <Button variant="primary" className="mt-4" onClick={() => navigate('/marketplace')}>
              Continue Shopping
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('/marketplace')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft size={16} /> Continue Shopping
      </button>

      <div className="flex items-baseline gap-2">
        <h1 className="text-xl font-bold text-gray-800">Your Cart</h1>
        <span className="text-sm text-gray-400">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

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
                  const lineSubtotal = item.price * item.qty

                  return (
                    <Card key={item.productId} className="flex items-center gap-4 flex-wrap">
                      <button
                        onClick={() => navigate(`/marketplace/product/${item.productId}`)}
                        className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden"
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          item.image
                        )}
                      </button>

                      <div className="flex-1 min-w-[140px]">
                        <button
                          onClick={() => navigate(`/marketplace/product/${item.productId}`)}
                          className="font-medium text-gray-800 hover:text-primary text-left truncate block w-full"
                        >
                          {item.title}
                        </button>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {formatPKR(item.price)} / {item.unit}
                        </p>
                        {overStock && (
                          <p className="text-xs text-danger mt-1">
                            Only {item.stock} {item.unit} left in stock — reduce quantity.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateCartQty(item.productId, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.productId, item.qty + 1)}
                          disabled={item.stock != null && item.qty >= item.stock}
                          className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right min-w-[92px]">
                        <p className="text-[11px] text-gray-400">Subtotal</p>
                        <p className="font-semibold text-primary">{formatPKR(lineSubtotal)}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-danger hover:bg-red-50 rounded-lg"
                        title="Remove from cart"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal ({itemCount})</span>
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

          <Button
            variant="primary"
            className="w-full mt-4"
            onClick={() => navigate('/marketplace/checkout')}
          >
            Proceed to Checkout
          </Button>

          <p className="text-xs text-gray-400 mt-2 text-center">
            Delivery charges and any coupon are applied by the server when your order is created.
          </p>
        </Card>
      </div>
    </div>
  )
}
