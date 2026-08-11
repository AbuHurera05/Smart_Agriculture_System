import { Star, MapPin, ShoppingCart, BadgeCheck, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProductCard({ product, onAddToCart, onView }) {
  const outOfStock = product.stock <= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="card flex flex-col overflow-hidden !p-0"
    >
      <button
        onClick={() => onView?.(product)}
        className="relative h-36 w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-5xl"
      >
        {product.image}
        {product.organic && (
          <span className="absolute top-2 left-2 badge badge-success flex items-center gap-1">
            <Leaf size={12} /> Organic
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-sm font-semibold">
            Out of Stock
          </span>
        )}
      </button>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => onView?.(product)}
            className="text-left font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-1"
          >
            {product.title}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <MapPin size={12} />
          <span className="line-clamp-1">{product.sellerLocation}</span>
        </div>

        <div className="flex items-center gap-1 mt-1 text-xs">
          <Star size={12} className="text-secondary fill-secondary" />
          <span className="font-medium text-gray-700">{product.rating?.toFixed(1) ?? '0.0'}</span>
          <span className="text-gray-400">({product.reviewsCount ?? 0})</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 line-clamp-1 flex items-center gap-0.5">
            {product.sellerName}
            {product.sellerVerified && <BadgeCheck size={12} className="text-info" />}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-primary">
              ₹{product.price.toLocaleString()}
              <span className="text-xs font-normal text-gray-500"> / {product.unit}</span>
            </p>
            <p className="text-xs text-gray-400">{product.stock} {product.unit} available</p>
          </div>
          <button
            disabled={outOfStock}
            onClick={() => onAddToCart?.(product)}
            className="p-2.5 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
