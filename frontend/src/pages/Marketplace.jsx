import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, ShoppingCart, Store, Package, ClipboardList, Heart,
  Star, Truck, ShieldCheck, BadgePercent, SlidersHorizontal,
  X, Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/common/Button'
import { SkeletonCard } from '../components/common/Skeleton'
import ProductCard from '../components/marketplace/ProductCard'
import BecomeSellerModal from '../components/marketplace/BecomeSellerModal'
import useStore from '../store/useStore'
import { useAuthContext } from '../context/AuthContext'
import { marketplaceAPI } from '../services/api'
import { productFromResponse } from '../utils/marketplaceMapper'
import { productCategories } from '../utils/constants'

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback

const PAGE_SIZE = 12

export default function Marketplace() {
  const navigate = useNavigate()
  const { user, isSeller, becomeSeller } = useAuthContext()
  const { cartItems, addToCart, wishlist, toggleWishlist, isWishlisted } = useStore()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(productCategories) // fallback icons/labels until API responds
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceMax, setPriceMax] = useState('')
  const [organicOnly, setOrganicOnly] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const [showSellerModal, setShowSellerModal] = useState(false)

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => { setPage(1) }, [debouncedSearch, category, sortBy, priceMax, organicOnly, verifiedOnly])

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await marketplaceAPI.getProducts()
      // const list = (res.data?.data ?? res.data ?? []).map(productFromResponse)
      const raw = res.data?.data ?? res.data?.content ?? res.data ?? []
      const list = (Array.isArray(raw) ? raw : []).map(productFromResponse)
      setProducts(list)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load marketplace products'))
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await marketplaceAPI.getCategories()
      const list = res.data?.data ?? res.data
      if (Array.isArray(list) && list.length) {
        setCategories(list.map((c) => {
          const id = (typeof c === 'string' ? c : c.id || c.name || '').toLowerCase()
          const fallback = productCategories.find((pc) => pc.id === id)
          return {
            id,
            name: fallback?.name || (typeof c === 'string' ? c : c.name) || id,
            icon: fallback?.icon || '📦',
          }
        }))
      }
    } catch {
      // Non-fatal: fall back to the static category list already in state.
    }
  }

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const matchesSearch = !debouncedSearch ||
        p.title.toLowerCase().includes(debouncedSearch) ||
        p.description.toLowerCase().includes(debouncedSearch) ||
        p.sellerName?.toLowerCase().includes(debouncedSearch)
      const matchesCategory = category === 'all' || p.category === category
      const matchesPrice = !priceMax || p.price <= Number(priceMax)
      const matchesOrganic = !organicOnly || p.organic
      const matchesVerified = !verifiedOnly || p.sellerVerified
      return matchesSearch && matchesCategory && matchesPrice && matchesOrganic && matchesVerified
    })

    const discountPct = (p) => (p.originalPrice && p.originalPrice > p.price)
      ? (p.originalPrice - p.price) / p.originalPrice
      : 0

    switch (sortBy) {
      case 'price-low': return [...list].sort((a, b) => a.price - b.price)
      case 'price-high': return [...list].sort((a, b) => b.price - a.price)
      case 'rating': return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      case 'popular': return [...list].sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0))
      case 'newest': return [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      case 'discount': return [...list].sort((a, b) => discountPct(b) - discountPct(a))
      default: return list
    }
  }, [products, debouncedSearch, category, sortBy, priceMax, organicOnly, verifiedOnly])

  const pagedProducts = filteredProducts.slice(0, page * PAGE_SIZE)
  const hasMore = pagedProducts.length < filteredProducts.length

  // ---- Derived, real sections (no fabricated data — just different sorts
  // of the same live product list) ----
  const dealsProducts = useMemo(
    () => products.filter((p) => p.originalPrice && p.originalPrice > p.price)
      .sort((a, b) => (b.originalPrice - b.price) / b.originalPrice - (a.originalPrice - a.price) / a.originalPrice)
      .slice(0, 8),
    [products]
  )
  const topRated = useMemo(
    () => [...products].filter((p) => p.reviewsCount > 0).sort((a, b) => b.rating - a.rating).slice(0, 8),
    [products]
  )
  const recentlyAdded = useMemo(
    () => [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 8),
    [products]
  )

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
      imageUrl: product.imageUrl,
      stock: product.stock,
    })
    toast.success(`${product.title} added to cart`)
  }

  const handleBecomeSeller = async (data) => {
    const res = await becomeSeller(data)
    if (res.success) {
      setShowSellerModal(false)
      navigate('/marketplace/seller')
    }
  }

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary to-secondary-dark text-white p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 px-3 py-1 rounded-full mb-3">
              <Truck size={13} /> Direct from farm to buyer, nationwide
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">AgroBazaar Marketplace</h1>
            <p className="text-white/70 text-sm mt-1.5 max-w-md">
              Buy and sell produce, seeds, fertilizers, equipment & livestock — grown, made and sold by the farming community.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/marketplace/orders')}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-colors"
            >
              <ClipboardList size={16} /> My Orders
            </button>
            <button
              onClick={() => navigate('/marketplace/wishlist')}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-colors"
            >
              <Heart size={16} /> Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => navigate('/marketplace/cart')}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-colors"
            >
              <ShoppingCart size={16} /> Cart ({cartCount})
            </button>
            <button
              onClick={() => isSeller ? navigate('/marketplace/seller') : setShowSellerModal(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-secondary shadow flex items-center gap-2 hover:brightness-95 transition"
            >
              <Store size={16} /> {isSeller ? 'Seller Dashboard' : 'Start Selling'}
            </button>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-10 text-[9rem] opacity-10 select-none pointer-events-none">🌾</div>
      </div>

      {/* Trust strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 px-1">
        <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-primary" /> Verified sellers</span>
        <span className="flex items-center gap-1.5"><Truck size={14} className="text-primary" /> Farm-to-buyer delivery</span>
        <span className="flex items-center gap-1.5"><BadgePercent size={14} className="text-primary" /> {dealsProducts.length} active deals today</span>
      </div>

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, sellers, e.g. rice, seeds, tractor..."
            className="flex-1 outline-none px-2 text-sm bg-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field sm:w-52"
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="popular">Most Reviewed</option>
          <option value="newest">Newest</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>

      {/* Category pill rail */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setCategory('all')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${category === 'all' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'}`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${category === c.id ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'}`}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
      </div>

      {/* Filters (drawer on mobile, inline strip on desktop) */}
      <div className={`${showFilters ? 'block' : 'hidden'} sm:flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 text-sm`}>
        <div className="flex items-center gap-2">
          <label className="text-gray-500">Max price</label>
          <input
            type="number"
            min="0"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Any"
            className="input-field !w-28 !py-1"
          />
        </div>
        <label className="flex items-center gap-1.5 text-gray-600">
          <input type="checkbox" checked={organicOnly} onChange={(e) => setOrganicOnly(e.target.checked)} /> Organic only
        </label>
        <label className="flex items-center gap-1.5 text-gray-600">
          <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} /> Verified sellers only
        </label>
        {(priceMax || organicOnly || verifiedOnly) && (
          <button
            onClick={() => { setPriceMax(''); setOrganicOnly(false); setVerifiedOnly(false) }}
            className="flex items-center gap-1 text-xs text-danger ml-auto"
          >
            <X size={13} /> Clear filters
          </button>
        )}
      </div>

      {/* Derived real sections — only shown when there's real data for them */}
      {!loading && !error && !debouncedSearch && category === 'all' && (
        <>
          {dealsProducts.length > 0 && (
            <ProductRail title="Deals" icon={BadgePercent} products={dealsProducts}
              onAddToCart={handleAddToCart} onView={(p) => navigate(`/marketplace/product/${p.id}`)}
              wishlist={wishlist} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />
          )}
          {topRated.length > 0 && (
            <ProductRail title="Best Sellers" icon={Star} products={topRated}
              onAddToCart={handleAddToCart} onView={(p) => navigate(`/marketplace/product/${p.id}`)}
              wishlist={wishlist} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />
          )}
          {recentlyAdded.length > 0 && (
            <ProductRail title="Recently Added" icon={Sparkles} products={recentlyAdded}
              onAddToCart={handleAddToCart} onView={(p) => navigate(`/marketplace/product/${p.id}`)}
              wishlist={wishlist} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />
          )}
        </>
      )}

      {/* Main catalog grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">
            {debouncedSearch || category !== 'all' ? 'Search Results' : 'All Products'}
            {!loading && <span className="text-gray-400 font-normal"> ({filteredProducts.length})</span>}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={loadProducts} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState icon={Package} title="No products found" subtitle="Try a different search term, category or filter." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pagedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={handleAddToCart}
                  onView={(prod) => navigate(`/marketplace/product/${prod.id}`)}
                  isWishlisted={isWishlisted(p.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={() => setPage((p) => p + 1)}>Load more</Button>
              </div>
            )}
          </>
        )}
      </div>

      {showSellerModal && (
        <BecomeSellerModal onClose={() => setShowSellerModal(false)} onSubmit={handleBecomeSeller} />
      )}
    </div>
  )
}

function ProductRail({ title, icon: Icon, products, onAddToCart, onView, toggleWishlist, isWishlisted }) {
  if (!products.length) return null
  return (
    <div>
      <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
        <Icon size={17} className="text-primary" /> {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {products.map((p) => (
          <div key={p.id} className="w-56 shrink-0">
            <ProductCard
              product={p}
              onAddToCart={onAddToCart}
              onView={onView}
              isWishlisted={isWishlisted(p.id)}
              onToggleWishlist={toggleWishlist}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
      <Icon size={40} className="mb-3 opacity-50" />
      <p className="font-medium text-gray-600">{title}</p>
      <p className="text-sm mt-1">{subtitle}</p>
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
      <p className="font-medium text-danger">Something went wrong</p>
      <p className="text-sm mt-1 max-w-sm">{message}</p>
      {onRetry && <Button variant="outline" className="mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  )
}