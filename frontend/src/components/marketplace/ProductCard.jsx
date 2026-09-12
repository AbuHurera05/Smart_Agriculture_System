import { Star, ShoppingCart, BadgeCheck, Leaf, Heart, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

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

export default function ProductCard({ product, onAddToCart, onView, isWishlisted, onToggleWishlist }) {
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
          {product.sellerName}
          {product.sellerVerified && <BadgeCheck size={11} className="text-info shrink-0" />}
          <span className="text-gray-300">•</span>
          {product.sellerLocation}
        </p>

        <div className="mt-2.5 flex items-baseline gap-1.5 flex-wrap">
          <p className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</p>
          {hasDiscount && (
            <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
          )}
          <span className="text-[11px] font-normal text-gray-500">/ {product.unit}</span>
        </div>
        <p className="text-[11px] text-gray-400">{product.stock} {product.unit} available</p>

        <button
          disabled={outOfStock}
          onClick={() => onAddToCart?.(product)}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={15} /> Add to Cart
        </button>
      </div>
    </motion.div>
  )
}
