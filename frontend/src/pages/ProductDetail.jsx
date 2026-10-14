import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Star, ShoppingCart, Heart, Share2, BadgeCheck, MapPin, Minus, Plus,
  Leaf, Zap, ChevronLeft, MessageCircle, ShieldCheck, Truck, RotateCcw,
  CheckCircle2, ThumbsUp, Calendar, User, Sparkles, MessageSquare, Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import ProductCard from '../components/marketplace/ProductCard'
import useStore from '../store/useStore'
import { useAuthContext } from '../context/AuthContext'
import { marketplaceAPI } from '../services/api'
import { productFromResponse, unwrapList, unwrapOne } from '../utils/marketplaceMapper'
import { formatPKR } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'
import { ErrorState } from './Marketplace'

const specLabels = {
  crop: 'Crop', variety: 'Variety', germinationRate: 'Germination Rate',
  packSize: 'Pack Size', harvestDuration: 'Harvest Duration', soil: 'Soil',
  season: 'Season', region: 'Region', expiry: 'Expiry', certification: 'Certification',
  npk: 'NPK Ratio', fertilizerType: 'Type', weight: 'Weight',
  activeIngredient: 'Active Ingredient', targetPest: 'Target Pest',
  application: 'Application', suitableCrops: 'Suitable Crops', safetyInfo: 'Safety Info',
  brand: 'Brand', model: 'Model', condition: 'Condition', year: 'Year',
  enginePower: 'Engine Power', warranty: 'Warranty', harvestDate: 'Harvest Date', grade: 'Grade',
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const { user, isAuthenticated } = useAuthContext()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [filterRating, setFilterRating] = useState('all')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)

  const loadReviews = async (productId) => {
    setLoadingReviews(true)
    try {
      const res = await marketplaceAPI.getProductReviews(productId)
      const list = unwrapList(res)
      setReviews(list)
      // Pre-fill user review if they previously reviewed
      if (user?.id) {
        const myReview = list.find((r) => r.reviewerId === user.id)
        if (myReview) {
          setReviewRating(myReview.rating || 5)
          setReviewText(myReview.comment || '')
        }
      }
    } catch {
      setReviews([])
    } finally {
      setLoadingReviews(false)
    }
  }

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await marketplaceAPI.getProductById(id)
      const p = productFromResponse(unwrapOne(res))
      setProduct(p)
      setQty(1)
      setActiveImage(0)

      try {
        const allRes = await marketplaceAPI.getProducts({ category: p.category, size: 12 })
        const all = unwrapList(allRes).map(productFromResponse)
        setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 8))
      } catch {
        setRelated([])
      }
    } catch (err) {
      setError(getApiErrorMessage(err, { 404: 'Product not found.' }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    loadReviews(id)
  }, [id])

  const userHasReviewed = useMemo(() => {
    if (!user?.id || !reviews.length) return false
    return reviews.some((r) => r.reviewerId === user.id)
  }, [user, reviews])

  const ratingStats = useMemo(() => {
    const total = reviews.length
    if (total === 0) {
      const initialAvg = product?.rating ?? 0
      const initialCount = product?.reviewsCount ?? 0
      return {
        avg: initialAvg,
        count: initialCount,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      }
    }
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let sum = 0
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)))
      breakdown[star] = (breakdown[star] || 0) + 1
      sum += r.rating || 5
    })
    const avg = Math.round((sum / total) * 10) / 10
    const percentages = {
      5: Math.round((breakdown[5] / total) * 100),
      4: Math.round((breakdown[4] / total) * 100),
      3: Math.round((breakdown[3] / total) * 100),
      2: Math.round((breakdown[2] / total) * 100),
      1: Math.round((breakdown[1] / total) * 100),
    }
    return { avg, count: total, breakdown, percentages }
  }, [reviews, product])

  const displayedReviews = useMemo(() => {
    if (filterRating === 'all') return reviews
    const star = Number(filterRating)
    return reviews.filter((r) => Math.round(r.rating) === star)
  }, [reviews, filterRating])

  const specEntries = useMemo(() => {
    if (!product?.specifications) return []
    return Object.entries(product.specifications).filter(([, v]) => v !== null && v !== undefined && v !== '')
  }, [product])

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader label="Loading product..." />
      </div>
    )
  }
  if (error || !product) {
    return <ErrorState message={error || 'Product not found'} onRetry={load} />
  }

  const outOfStock = (product.stock ?? 0) <= 0
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const images = product.images?.length ? product.images : null
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (goToCart = false) => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      unit: product.unit,
      qty,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      image: product.image,
      imageUrl: product.imageUrl,
      stock: product.stock,
    })
    toast.success(`${product.title} added to cart`)
    if (goToCart) {
      if (!isAuthenticated && !user) {
        toast('Item added to cart! Please sign in to complete your checkout.', { icon: '🔐' })
        navigate('/login?redirect=/marketplace/checkout')
        return
      }
      navigate('/marketplace/checkout')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: product.title, url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewText.trim()) {
      toast.error('Please write a short review sharing your experience.')
      return
    }
    setSubmittingReview(true)
    try {
      await marketplaceAPI.addProductReview(product.id, { rating: reviewRating, comment: reviewText })
      toast.success(userHasReviewed ? 'Your review has been updated!' : 'Review submitted successfully!')
      await Promise.all([load(), loadReviews(product.id)])
    } catch (err) {
      toast.error(getApiErrorMessage(err, { 404: 'Product not found.' }))
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 text-8xl ring-1 ring-slate-100 sm:h-96 dark:from-white/5 dark:to-white/5 dark:ring-white/10">
            {images ? (
              <img
                src={images[activeImage]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              product.image
            )}

            {hasDiscount && (
              <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                -{discountPct}%
              </span>
            )}

            {product.organic && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                <Leaf size={11} /> Organic
              </span>
            )}
          </div>

          {images && images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                    activeImage === i
                      ? 'ring-green-500'
                      : 'ring-transparent hover:ring-slate-200 dark:hover:ring-white/10'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {product.videoUrl && (
            <video src={product.videoUrl} controls className="mt-1 w-full rounded-xl" />
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                {product.title}
              </h1>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i <= Math.round(ratingStats.avg)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200 dark:fill-white/10 dark:text-white/10'
                    }
                  />
                ))}
              </div>
              <a
                href="#reviews"
                className="flex items-center gap-1.5 transition-colors hover:text-green-600"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {(ratingStats.avg ?? 0).toFixed(1)}
                </span>
                <span className="text-slate-400 hover:text-green-600 underline underline-offset-2">
                  ({ratingStats.count} {ratingStats.count === 1 ? 'review' : 'reviews'})
                </span>
              </a>
              {product.negotiable && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 ring-1 ring-inset ring-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                  <Zap size={11} /> Negotiable
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-400">
              {formatPKR(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-slate-400 line-through">
                {formatPKR(product.originalPrice)}
              </span>
            )}
            <span className="text-sm font-medium text-slate-500">
              / {product.unit}
            </span>
          </div>

          <p
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
              outOfStock
                ? 'bg-red-50 text-red-700 ring-red-500/20 dark:bg-red-500/10 dark:text-red-400'
                : 'bg-green-50 text-green-700 ring-green-500/20 dark:bg-green-500/10 dark:text-green-400'
            }`}
          >
            {outOfStock
              ? 'Out of stock'
              : `${product.stock} ${product.unit} available`}
          </p>

          {!outOfStock && (
            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm font-semibold text-slate-800 dark:text-white">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="p-3 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex-1"
              disabled={outOfStock}
              onClick={() => handleAddToCart(false)}
            >
              <ShoppingCart size={16} /> Add to Cart
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={outOfStock}
              onClick={() => handleAddToCart(true)}
            >
              <Zap size={16} /> Buy Now
            </Button>
            <button
              onClick={() => toggleWishlist(product)}
              className="rounded-xl border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
              title="Save to wishlist"
            >
              <Heart
                size={18}
                className={
                  isWishlisted(product.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-slate-400'
                }
              />
            </button>
            <button
              onClick={handleShare}
              className="rounded-xl border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
              title="Share"
            >
              <Share2 size={18} className="text-slate-500" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] dark:border-white/5 dark:bg-white/5">
            <div className="flex flex-col items-center gap-1 text-center">
              <Truck size={16} className="text-green-600 dark:text-green-400" />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Farm-to-buyer
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-slate-200 text-center dark:border-white/10">
              <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Buyer protection
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <RotateCcw size={16} className="text-green-600 dark:text-green-400" />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Easy returns
              </span>
            </div>
          </div>

          {/* Seller card */}
          <Card className="!p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400">
                  Sold by
                </p>
                <Link
                  to={
                    product.sellerId
                      ? `/marketplace/seller/${product.sellerId}`
                      : '#'
                  }
                  className="mt-0.5 flex items-center gap-1 truncate text-sm font-semibold text-slate-800 transition-colors hover:text-green-600 dark:text-white"
                >
                  {product.sellerName}
                  {product.sellerVerified && (
                    <BadgeCheck size={14} className="shrink-0 text-blue-500" />
                  )}
                </Link>
                {product.sellerLocation && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin size={11} /> {product.sellerLocation}
                  </p>
                )}
                {product.sellerRating != null && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {Number(product.sellerRating).toFixed(1)} seller rating
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                {product.sellerId && (
                  <Link
                    to={`/marketplace/seller/${product.sellerId}`}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-green-500 hover:text-green-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-green-500/50"
                  >
                    View Store
                  </Link>
                )}
                <button
                  onClick={() =>
                    toast(
                      'Direct chat needs a messaging backend — not yet available.',
                      { icon: 'ℹ️' }
                    )
                  }
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-green-500 hover:text-green-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-green-500/50"
                >
                  <MessageCircle size={13} /> Chat
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Description */}
      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
          Description
        </h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {product.description || 'No description provided.'}
        </p>
      </Card>

      {/* Specifications */}
      {specEntries.length > 0 && (
        <Card>
          <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
            Specifications
          </h2>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            {specEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0 dark:border-white/5"
              >
                <dt className="text-slate-500 dark:text-slate-400">
                  {specLabels[key] ||
                    key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (c) => c.toUpperCase())}
                </dt>
                <dd className="font-semibold text-slate-800 dark:text-white">
                  {String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      {/* Customer Reviews & Feedback */}
      <div id="reviews" className="space-y-6 pt-2">
        <Card>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Customer Reviews</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  خریداروں کے تاثرات
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real feedback from verified farmers and agricultural buyers
              </p>
            </div>

            <a
              href="#write-review"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-300 px-3 py-1.5 rounded-xl transition"
            >
              <MessageSquare size={13} />
              {userHasReviewed ? 'Edit Your Review' : 'Write a Review'}
            </a>
          </div>

          {/* Rating Breakdown & Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-100 dark:border-white/10">
            {/* Overall score */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
              <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {(ratingStats.avg ?? 0).toFixed(1)}
              </span>
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i <= Math.round(ratingStats.avg)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200 dark:fill-white/10 dark:text-white/10'
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                Based on {ratingStats.count} {ratingStats.count === 1 ? 'review' : 'reviews'}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} />
                100% Genuine Agricultural Feedback
              </div>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingStats.breakdown[stars] || 0
                const pct = ratingStats.percentages[stars] || 0
                const isSelected = filterRating === String(stars)
                return (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setFilterRating(isSelected ? 'all' : String(stars))}
                    className={`flex items-center gap-3 text-xs w-full text-left p-1 rounded-lg transition-colors ${
                      isSelected ? 'bg-amber-50 dark:bg-amber-950/30' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="w-14 shrink-0 font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span>{stars}</span>
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-slate-500 dark:text-slate-400 font-medium">
                      {pct}% ({count})
                    </span>
                  </button>
                )
              })}

              {filterRating !== 'all' && (
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-amber-700 dark:text-amber-300 font-medium">
                    Showing only {filterRating}-star reviews
                  </span>
                  <button
                    onClick={() => setFilterRating('all')}
                    className="text-green-600 hover:underline font-semibold"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* List of Customer Reviews */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Customer Feedback ({displayedReviews.length})</span>
            </h3>

            {loadingReviews ? (
              <div className="py-8 flex justify-center">
                <Loader label="Loading reviews..." />
              </div>
            ) : displayedReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-8 text-center bg-slate-50/50 dark:bg-white/5">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/40">
                  <Star size={24} className="fill-amber-400 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  No reviews match your selection yet
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {filterRating !== 'all'
                    ? `No ${filterRating}-star reviews yet for this product.`
                    : 'Be the first farmer to share your experience with this item. Your review helps the entire farming community!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-white/5">
                {displayedReviews.map((r) => {
                  const isMine = user?.id && r.reviewerId === user.id
                  const initial = (r.reviewerName || 'F').charAt(0).toUpperCase()
                  const reviewDate = r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Recently'

                  return (
                    <div key={r.id || `${r.reviewerName}-${r.createdAt}`} className="pt-4 first:pt-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-700 text-xs font-bold text-white shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {r.reviewerName || 'Farmer Customer'}
                              </span>
                              {isMine && (
                                <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                                  You
                                </span>
                              )}
                              {r.verifiedPurchase && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  <ShieldCheck size={11} /> Verified Buyer
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {reviewDate}
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i <= (r.rating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-slate-200 text-slate-200 dark:fill-white/10 dark:text-white/10'
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="mt-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-12">
                        {r.comment || 'No written comment provided.'}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Write / Edit Review Form */}
        <Card id="write-review">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span>{userHasReviewed ? 'Update Your Review' : 'Leave a Review for this Product'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              How did this product perform on your farm? Quality, yield, delivery, or results?
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Overall Rating *
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setReviewRating(i)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        size={26}
                        className={
                          i <= reviewRating
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'fill-slate-200 text-slate-200 hover:fill-amber-200 dark:fill-white/10 dark:text-white/10'
                        }
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {reviewRating === 5 && '5/5 - Excellent (بہترین)'}
                  {reviewRating === 4 && '4/5 - Very Good (بہت اچھا)'}
                  {reviewRating === 3 && '3/5 - Good (اچھا)'}
                  {reviewRating === 2 && '2/5 - Fair (گزارا)'}
                  {reviewRating === 1 && '1/5 - Poor (ناقص)'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Review *
              </label>
              <textarea
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                rows={3}
                placeholder="Share your experience (e.g. Fasal par kaisa asar hua, packaging aur delivery kaisi rahi?)..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600" />
                Verified buyers get a special trust badge next to their review.
              </p>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={submittingReview}
              >
                {userHasReviewed ? 'Update Review' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={(prod) => navigate(`/marketplace/product/${prod.id}`)}
                onAddToCart={() => {
                  addToCart({
                    productId: p.id,
                    title: p.title,
                    price: p.price,
                    unit: p.unit,
                    qty: 1,
                    sellerId: p.sellerId,
                    sellerName: p.sellerName,
                    image: p.image,
                    imageUrl: p.imageUrl,
                    stock: p.stock,
                  })
                  toast.success(`${p.title} added to cart`)
                }}
                isWishlisted={isWishlisted(p.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}