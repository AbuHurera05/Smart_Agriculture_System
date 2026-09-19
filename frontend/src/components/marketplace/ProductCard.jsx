// import { Star, ShoppingCart, BadgeCheck, Leaf, Heart, Zap } from 'lucide-react'
// import { motion } from 'framer-motion'
// import { formatPKR } from '../../utils/format'

// function StarRating({ rating = 0 }) {
//   const rounded = Math.round(rating)
//   return (
//     <div className="flex items-center">
//       {[1, 2, 3, 4, 5].map((i) => (
//         <Star
//           key={i}
//           size={12}
//           className={i <= rounded ? 'text-secondary-dark fill-[#ffb703]' : 'text-gray-300 fill-gray-200'}
//         />
//       ))}
//     </div>
//   )
// }

// export default function ProductCard({ product, onAddToCart, onBuyNow, onView, isWishlisted, onToggleWishlist }) {
//   const outOfStock = product.stock <= 0
//   const hasDiscount = product.originalPrice && product.originalPrice > product.price
//   const discountPct = hasDiscount
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : 0

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -4 }}
//       transition={{ duration: 0.25 }}
//       className="card flex flex-col overflow-hidden !p-0 group"
//     >
//       <button
//         onClick={() => onView?.(product)}
//         className="relative h-40 w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-6xl overflow-hidden"
//       >
//         <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
//           {hasDiscount && (
//             <span className="bg-danger text-white text-[11px] font-bold px-2 py-0.5 rounded">-{discountPct}%</span>
//           )}
//           {product.organic && (
//             <span className="badge badge-success flex items-center gap-1 !py-0.5">
//               <Leaf size={11} /> Organic
//             </span>
//           )}
//         </div>

//         {onToggleWishlist && (
//           <span
//             role="button"
//             tabIndex={0}
//             onClick={(e) => { e.stopPropagation(); onToggleWishlist(product) }}
//             onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onToggleWishlist(product) } }}
//             className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors z-10"
//             title="Save to wishlist"
//           >
//             <Heart size={15} className={isWishlisted ? 'fill-danger text-danger' : 'text-gray-400'} />
//           </span>
//         )}

//         {product.imageUrl ? (
//           <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
//         ) : (
//           product.image
//         )}

//         {outOfStock && (
//           <span className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-sm font-semibold">
//             Out of Stock
//           </span>
//         )}
//       </button>

//       <div className="p-3.5 flex-1 flex flex-col">
//         <button
//           onClick={() => onView?.(product)}
//           className="text-left font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-2 text-sm leading-snug min-h-[2.5em]"
//         >
//           {product.title}
//         </button>

//         <div className="flex items-center gap-1.5 mt-1.5 text-xs">
//           <StarRating rating={product.rating} />
//           <span className="text-gray-400">({product.reviewsCount ?? 0})</span>
//           {product.negotiable && (
//             <span className="text-info flex items-center gap-0.5 ml-auto shrink-0">
//               <Zap size={11} /> Negotiable
//             </span>
//           )}
//         </div>

//         <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-0.5 line-clamp-1">
//           {product.sellerName || 'SmartAgri Seller'}
//           {product.sellerVerified && <BadgeCheck size={11} className="text-info shrink-0" />}
//           {product.sellerLocation && (
//             <>
//               <span className="text-gray-300">•</span>
//               {product.sellerLocation}
//             </>
//           )}
//         </p>

//         {product.category && (
//           <span className="mt-1.5 self-start capitalize text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
//             {product.category}
//           </span>
//         )}

//         <div className="mt-2.5 flex items-baseline gap-1.5 flex-wrap">
//           <p className="text-lg font-bold text-primary">{formatPKR(product.price)}</p>
//           {hasDiscount && (
//             <p className="text-xs text-gray-400 line-through">{formatPKR(product.originalPrice)}</p>
//           )}
//           <span className="text-[11px] font-normal text-gray-500">/ {product.unit}</span>
//         </div>
//         <p className={`text-[11px] ${outOfStock ? 'text-danger font-medium' : 'text-gray-400'}`}>
//           {outOfStock
//             ? 'Out of Stock'
//             : `Stock: ${product.stock} ${product.unit || ''} available`}
//         </p>

//         <div className="mt-3 grid grid-cols-2 gap-2">
//           <button
//             disabled={outOfStock}
//             onClick={() => onAddToCart?.(product)}
//             className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-primary text-primary text-xs sm:text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
//           >
//             <ShoppingCart size={15} /> Add to Cart
//           </button>

//           <button
//             disabled={outOfStock}
//             onClick={() => (onBuyNow ? onBuyNow(product) : onView?.(product))}
//             className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-xs sm:text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             <Zap size={15} /> Buy Now
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }


import { Star, ShoppingCart, BadgeCheck, Leaf, Heart, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPKR } from '../../utils/format'
import { categoryLabel } from '../../utils/constants'

function StarRating({ rating = 0 }) {
  const rounded = Math.round(rating)
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= rounded ? 'text-secondary-dark fill-[#ffb703]' : 'text-gray-300 fill-gray-200'}
        />
      ))}
    </div>
  )
}

export default function ProductCard({ product, onAddToCart, onBuyNow, onView, isWishlisted, onToggleWishlist }) {
  const outOfStock = product.stock <= 0
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="card flex flex-col overflow-hidden !p-0 group"
    >
      <button
        onClick={() => onView?.(product)}
        className="relative h-40 w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-6xl overflow-hidden"
      >
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {hasDiscount && (
            <span className="bg-danger text-white text-[11px] font-bold px-2 py-0.5 rounded">-{discountPct}%</span>
          )}
          {product.organic && (
            <span className="badge badge-success flex items-center gap-1 !py-0.5">
              <Leaf size={11} /> Organic
            </span>
          )}
        </div>

        {onToggleWishlist && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product) }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onToggleWishlist(product) } }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors z-10"
            title="Save to wishlist"
          >
            <Heart size={15} className={isWishlisted ? 'fill-danger text-danger' : 'text-gray-400'} />
          </span>
        )}

        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          product.image
        )}

        {outOfStock && (
          <span className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-sm font-semibold">
            Out of Stock
          </span>
        )}
      </button>

      <div className="p-3.5 flex-1 flex flex-col">
        <button
          onClick={() => onView?.(product)}
          className="text-left font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-2 text-sm leading-snug min-h-[2.5em]"
        >
          {product.title}
        </button>

        <div className="flex items-center gap-1.5 mt-1.5 text-xs">
          <StarRating rating={product.rating} />
          <span className="text-gray-400">({product.reviewsCount ?? 0})</span>
          {product.negotiable && (
            <span className="text-info flex items-center gap-0.5 ml-auto shrink-0">
              <Zap size={11} /> Negotiable
            </span>
          )}
        </div>

        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-0.5 line-clamp-1">
          {product.sellerName || 'SmartAgri Seller'}
          {product.sellerVerified && <BadgeCheck size={11} className="text-info shrink-0" />}
          {product.sellerLocation && (
            <>
              <span className="text-gray-300">•</span>
              {product.sellerLocation}
            </>
          )}
        </p>

        {product.category && (
          <span className="mt-1.5 self-start text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {categoryLabel[product.category] || product.category}
          </span>
        )}

        <div className="mt-2.5 flex items-baseline gap-1.5 flex-wrap">
          <p className="text-lg font-bold text-primary">{formatPKR(product.price)}</p>
          {hasDiscount && (
            <p className="text-xs text-gray-400 line-through">{formatPKR(product.originalPrice)}</p>
          )}
          <span className="text-[11px] font-normal text-gray-500">/ {product.unit}</span>
        </div>
        <p className={`text-[11px] ${outOfStock ? 'text-danger font-medium' : 'text-gray-400'}`}>
          {outOfStock
            ? 'Out of Stock'
            : `Stock: ${product.stock} ${product.unit || ''} available`}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            disabled={outOfStock}
            onClick={() => onAddToCart?.(product)}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-primary text-primary text-xs sm:text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
          >
            <ShoppingCart size={15} /> Add to Cart
          </button>

          <button
            disabled={outOfStock}
            onClick={() => (onBuyNow ? onBuyNow(product) : onView?.(product))}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-xs sm:text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap size={15} /> Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  )
}
