import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, BadgeCheck, MapPin, Star, Package, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import { SkeletonCard } from '../components/common/Skeleton'
import ProductCard from '../components/marketplace/ProductCard'
import useStore from '../store/useStore'
import { marketplaceAPI } from '../services/api'
import { productFromResponse, sellerFromResponse } from '../utils/marketplaceMapper'
import { EmptyState, ErrorState } from './Marketplace'

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback

export default function SellerStore() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isWishlisted } = useStore()

  const [seller, setSeller] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [sellerRes, productsRes] = await Promise.all([
        marketplaceAPI.getSellerProfile(id),
        marketplaceAPI.getProducts(),
      ])
      setSeller(sellerFromResponse(sellerRes.data?.data ?? sellerRes.data))
      const all = (productsRes.data?.data ?? productsRes.data ?? []).map(productFromResponse)
      setProducts(all.filter((p) => String(p.sellerId) === String(id)))
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load this seller'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }
  if (error || !seller) {
    return <ErrorState message={error || 'Seller not found'} onRetry={load} />
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft size={16} /> Back
      </button>

      <Card>
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl shrink-0 overflow-hidden">
            {seller.logoUrl ? <img src={seller.logoUrl} alt="" className="w-full h-full object-cover" /> : '🏪'}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-gray-800">{seller.shopName}</h1>
              {seller.verified && <span className="badge badge-info flex items-center gap-1"><BadgeCheck size={11} /> Verified Seller</span>}
            </div>
            {seller.location && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={13} /> {seller.location}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Star size={13} className="text-secondary-dark fill-[#ffb703]" /> {seller.rating.toFixed(1)} ({seller.reviewsCount})</span>
              <span className="flex items-center gap-1"><Package size={13} /> {products.length} products</span>
              {seller.followerCount != null && <span>{seller.followerCount} followers</span>}
            </div>
            {seller.description && <p className="text-sm text-gray-600 mt-3 max-w-2xl">{seller.description}</p>}
          </div>
          <button
            onClick={() => toast('Direct messaging needs a chat backend — not yet available.', { icon: 'ℹ️' })}
            className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 shrink-0"
          >
            <MessageCircle size={14} /> Message
          </button>
        </div>
      </Card>

      <div>
        <h2 className="font-semibold text-gray-800 mb-3">Products from {seller.shopName}</h2>
        {products.length === 0 ? (
          <EmptyState icon={Package} title="No products listed yet" subtitle="This seller hasn't published any listings." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={(prod) => navigate(`/marketplace/product/${prod.id}`)}
                onAddToCart={() => {
                  addToCart({ productId: p.id, title: p.title, price: p.price, unit: p.unit, qty: 1, sellerId: p.sellerId, sellerName: p.sellerName, image: p.image, imageUrl: p.imageUrl, stock: p.stock })
                  toast.success(`${p.title} added to cart`)
                }}
                isWishlisted={isWishlisted(p.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}