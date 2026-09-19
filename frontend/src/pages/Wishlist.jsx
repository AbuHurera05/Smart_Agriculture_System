// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { ChevronLeft, Heart, ShoppingCart, Trash2, AlertTriangle } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Card from '../components/common/Card'
// import Button from '../components/common/Button'
// import { SkeletonCard } from '../components/common/Skeleton'
// import useStore from '../store/useStore'
// import { marketplaceAPI } from '../services/api'
// import { productFromResponse } from '../utils/marketplaceMapper'
// import { EmptyState } from './Marketplace'

// export default function Wishlist() {
//   const navigate = useNavigate()
//   const { wishlist, removeFromWishlist, addToCart } = useStore()
//   const [live, setLive] = useState({}) // productId -> live product (or null if it 404s / was removed)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     let cancelled = false
//     const sync = async () => {
//       setLoading(true)
//       const entries = await Promise.all(
//         wishlist.map(async (w) => {
//           try {
//             const res = await marketplaceAPI.getProductById(w.productId)
//             return [w.productId, productFromResponse(res.data?.data ?? res.data)]
//           } catch {
//             return [w.productId, null] // product no longer exists / seller removed it
//           }
//         })
//       )
//       if (!cancelled) {
//         setLive(Object.fromEntries(entries))
//         setLoading(false)
//       }
//     }
//     if (wishlist.length) sync(); else setLoading(false)
//     return () => { cancelled = true }
//   }, [wishlist.length])

//   if (!loading && wishlist.length === 0) {
//     return (
//       <div className="space-y-4">
//         <button onClick={() => navigate('/marketplace')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
//           <ChevronLeft size={16} /> Back to Marketplace
//         </button>
//         <EmptyState
//           icon={Heart}
//           title="Your wishlist is empty"
//           subtitle="Tap the heart icon on any product to save it here."
//           action={<Button variant="primary" className="mt-4" onClick={() => navigate('/marketplace')}>Browse Products</Button>}
//         />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-5">
//       <button onClick={() => navigate('/marketplace')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
//         <ChevronLeft size={16} /> Back to Marketplace
//       </button>
//       <h1 className="text-xl font-bold text-gray-800">Wishlist</h1>

//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {wishlist.map((w) => {
//             const current = live[w.productId]
//             const removed = current === null
//             const priceChanged = current && current.price !== w.price
//             return (
//               <Card key={w.productId} className="flex items-center gap-4 flex-wrap">
//                 <button
//                   onClick={() => !removed && navigate(`/marketplace/product/${w.productId}`)}
//                   className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden"
//                 >
//                   {current?.imageUrl ? <img src={current.imageUrl} alt="" className="w-full h-full object-cover" /> : (current?.image || w.image || '📦')}
//                 </button>
//                 <div className="flex-1 min-w-[160px]">
//                   <p className="font-medium text-gray-800 truncate">{current?.title || w.title}</p>
//                   {removed ? (
//                     <p className="text-xs text-danger flex items-center gap-1 mt-1"><AlertTriangle size={12} /> No longer available</p>
//                   ) : (
//                     <>
//                       <p className="text-sm font-semibold text-primary mt-1">
//                         Rs. {current.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ {current.unit}</span>
//                       </p>
//                       {priceChanged && (
//                         <p className="text-xs text-warning">Price changed from Rs. {w.price?.toLocaleString()}</p>
//                       )}
//                       <p className="text-xs text-gray-400">
//                         {current.stock > 0 ? `${current.stock} ${current.unit} available` : 'Out of stock'}
//                       </p>
//                     </>
//                   )}
//                 </div>
//                 {!removed && (
//                   <Button
//                     size="sm"
//                     variant="primary"
//                     disabled={current.stock <= 0}
//                     onClick={() => {
//                       addToCart({
//                         productId: current.id, title: current.title, price: current.price, unit: current.unit,
//                         qty: 1, sellerId: current.sellerId, sellerName: current.sellerName, image: current.image,
//                         imageUrl: current.imageUrl, stock: current.stock,
//                       })
//                       removeFromWishlist(current.id)
//                       toast.success('Moved to cart')
//                     }}
//                   >
//                     <ShoppingCart size={14} /> Move to Cart
//                   </Button>
//                 )}
//                 <button onClick={() => removeFromWishlist(w.productId)} className="p-2 text-danger hover:bg-red-50 rounded-lg">
//                   <Trash2 size={16} />
//                 </button>
//               </Card>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Heart, ShoppingCart, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { SkeletonCard } from '../components/common/Skeleton'
import useStore from '../store/useStore'
import { marketplaceAPI } from '../services/api'
import { productFromResponse, unwrapOne } from '../utils/marketplaceMapper'
import { EmptyState } from './Marketplace'

export default function Wishlist() {
  const navigate = useNavigate()
  const { wishlist, removeFromWishlist, addToCart } = useStore()
  const [live, setLive] = useState({}) // productId -> live product (or null if it 404s / was removed)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const sync = async () => {
      setLoading(true)
      const entries = await Promise.all(
        wishlist.map(async (w) => {
          try {
            const res = await marketplaceAPI.getProductById(w.productId)
            return [w.productId, productFromResponse(unwrapOne(res))]
          } catch {
            return [w.productId, null] // product no longer exists / seller removed it
          }
        })
      )
      if (!cancelled) {
        setLive(Object.fromEntries(entries))
        setLoading(false)
      }
    }
    if (wishlist.length) sync(); else setLoading(false)
    return () => { cancelled = true }
  }, [wishlist.length])

  if (!loading && wishlist.length === 0) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/marketplace')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16} /> Back to Marketplace
        </button>
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          subtitle="Tap the heart icon on any product to save it here."
          action={<Button variant="primary" className="mt-4" onClick={() => navigate('/marketplace')}>Browse Products</Button>}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/marketplace')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft size={16} /> Back to Marketplace
      </button>
      <h1 className="text-xl font-bold text-gray-800">Wishlist</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {wishlist.map((w) => {
            const current = live[w.productId]
            const removed = current === null
            const priceChanged = current && current.price !== w.price
            return (
              <Card key={w.productId} className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => !removed && navigate(`/marketplace/product/${w.productId}`)}
                  className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden"
                >
                  {current?.imageUrl ? <img src={current.imageUrl} alt="" className="w-full h-full object-cover" /> : (current?.image || w.image || '📦')}
                </button>
                <div className="flex-1 min-w-[160px]">
                  <p className="font-medium text-gray-800 truncate">{current?.title || w.title}</p>
                  {removed ? (
                    <p className="text-xs text-danger flex items-center gap-1 mt-1"><AlertTriangle size={12} /> No longer available</p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-primary mt-1">
                        Rs. {current.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ {current.unit}</span>
                      </p>
                      {priceChanged && (
                        <p className="text-xs text-warning">Price changed from Rs. {w.price?.toLocaleString()}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {current.stock > 0 ? `${current.stock} ${current.unit} available` : 'Out of stock'}
                      </p>
                    </>
                  )}
                </div>
                {!removed && (
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={current.stock <= 0}
                    onClick={() => {
                      addToCart({
                        productId: current.id, title: current.title, price: current.price, unit: current.unit,
                        qty: 1, sellerId: current.sellerId, sellerName: current.sellerName, image: current.image,
                        imageUrl: current.imageUrl, stock: current.stock,
                      })
                      removeFromWishlist(current.id)
                      toast.success('Moved to cart')
                    }}
                  >
                    <ShoppingCart size={14} /> Move to Cart
                  </Button>
                )}
                <button onClick={() => removeFromWishlist(w.productId)} className="p-2 text-danger hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}