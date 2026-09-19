// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate, useParams, Link } from 'react-router-dom'
// import {
//   Star, ShoppingCart, Heart, Share2, BadgeCheck, MapPin, Minus, Plus,
//   Leaf, Zap, ChevronLeft, MessageCircle, ShieldCheck,
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Card from '../components/common/Card'
// import Button from '../components/common/Button'
// import Loader from '../components/common/Loader'
// import ProductCard from '../components/marketplace/ProductCard'
// import useStore from '../store/useStore'
// import { marketplaceAPI } from '../services/api'
// import { productFromResponse } from '../utils/marketplaceMapper'
// import { formatPKR } from '../utils/format'
// import { getApiErrorMessage } from '../utils/apiError'
// import { ErrorState } from './Marketplace'

// // Human-readable labels for the free-form `specifications` bag. Any key not
// // listed here still renders (title-cased), so nothing gets silently hidden.
// const specLabels = {
//   crop: 'Crop', variety: 'Variety', germinationRate: 'Germination Rate',
//   packSize: 'Pack Size', harvestDuration: 'Harvest Duration', soil: 'Soil',
//   season: 'Season', region: 'Region', expiry: 'Expiry', certification: 'Certification',
//   npk: 'NPK Ratio', fertilizerType: 'Type', weight: 'Weight',
//   activeIngredient: 'Active Ingredient', targetPest: 'Target Pest',
//   application: 'Application', suitableCrops: 'Suitable Crops', safetyInfo: 'Safety Info',
//   brand: 'Brand', model: 'Model', condition: 'Condition', year: 'Year',
//   enginePower: 'Engine Power', warranty: 'Warranty', harvestDate: 'Harvest Date', grade: 'Grade',
// }

// export default function ProductDetail() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { addToCart, toggleWishlist, isWishlisted } = useStore()

//   const [product, setProduct] = useState(null)
//   const [related, setRelated] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [qty, setQty] = useState(1)
//   const [activeImage, setActiveImage] = useState(0)
//   const [reviewText, setReviewText] = useState('')
//   const [reviewRating, setReviewRating] = useState(5)
//   const [submittingReview, setSubmittingReview] = useState(false)

//   const load = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const res = await marketplaceAPI.getProductById(id)
//       const p = productFromResponse(res.data?.data ?? res.data)
//       setProduct(p)
//       setQty(1)
//       setActiveImage(0)

//       // Related products: same category, real data, excluding this one.
//       try {
//         const allRes = await marketplaceAPI.getProducts()
//         const all = (allRes.data?.data ?? allRes.data ?? []).map(productFromResponse)
//         setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 8))
//       } catch {
//         setRelated([])
//       }
//     } catch (err) {
//       setError(getApiErrorMessage(err, { 404: 'Product not found.' }))
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { load() }, [id])

//   const specEntries = useMemo(() => {
//     if (!product?.specifications) return []
//     return Object.entries(product.specifications).filter(([, v]) => v !== null && v !== undefined && v !== '')
//   }, [product])

//   if (loading) {
//     return <div className="py-24 flex justify-center"><Loader label="Loading product..." /></div>
//   }
//   if (error || !product) {
//     return <ErrorState message={error || 'Product not found'} onRetry={load} />
//   }

//   const outOfStock = (product.stock ?? 0) <= 0
//   const hasDiscount = product.originalPrice && product.originalPrice > product.price
//   const images = product.images?.length ? product.images : null

//   const handleAddToCart = (goToCart = false) => {
//     addToCart({
//       productId: product.id,
//       title: product.title,
//       price: product.price,
//       unit: product.unit,
//       qty,
//       sellerId: product.sellerId,
//       sellerName: product.sellerName,
//       image: product.image,
//       imageUrl: product.imageUrl,
//       stock: product.stock,
//     })
//     toast.success(`${product.title} added to cart`)
//     if (goToCart) navigate('/marketplace/checkout')
//   }

//   const handleShare = async () => {
//     const url = window.location.href
//     if (navigator.share) {
//       try { await navigator.share({ title: product.title, url }) } catch { /* cancelled */ }
//     } else {
//       await navigator.clipboard.writeText(url)
//       toast.success('Link copied to clipboard')
//     }
//   }

//   const handleSubmitReview = async (e) => {
//     e.preventDefault()
//     if (!reviewText.trim()) {
//       toast.error('Please write a short review')
//       return
//     }
//     setSubmittingReview(true)
//     try {
//       await marketplaceAPI.addProductReview(product.id, { rating: reviewRating, comment: reviewText })
//       toast.success('Review submitted')
//       setReviewText('')
//       load()
//     } catch (err) {
//       // Backend enforces "verified purchase only" — surface whatever it says.
//       toast.error(getApiErrorMessage(err, { 404: 'Product not found.' }))
//     } finally {
//       setSubmittingReview(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
//         <ChevronLeft size={16} /> Back
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Gallery */}
//         <div>
//           <div className="relative h-80 sm:h-96 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-8xl overflow-hidden">
//             {images ? (
//               <img src={images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
//             ) : (
//               product.image
//             )}
//             {hasDiscount && (
//               <span className="absolute top-3 left-3 bg-danger text-white text-xs font-bold px-2.5 py-1 rounded">
//                 -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
//               </span>
//             )}
//           </div>
//           {images && images.length > 1 && (
//             <div className="flex gap-2 mt-3">
//               {images.map((img, i) => (
//                 <button
//                   key={img + i}
//                   onClick={() => setActiveImage(i)}
//                   className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImage === i ? 'border-primary' : 'border-transparent'}`}
//                 >
//                   <img src={img} alt="" className="w-full h-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           )}
//           {product.videoUrl && (
//             <video src={product.videoUrl} controls className="w-full mt-3 rounded-xl" />
//           )}
//         </div>

//         {/* Info */}
//         <div className="space-y-4">
//           <div>
//             <div className="flex items-center gap-2 flex-wrap">
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{product.title}</h1>
//               {product.organic && <span className="badge badge-success flex items-center gap-1"><Leaf size={11} /> Organic</span>}
//             </div>
//             <div className="flex items-center gap-2 mt-2 text-sm">
//               <div className="flex items-center gap-0.5">
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <Star key={i} size={14} className={i <= Math.round(product.rating) ? 'text-secondary-dark fill-[#ffb703]' : 'text-gray-300 fill-gray-200'} />
//                 ))}
//               </div>
//               <span className="text-gray-500">{product.rating.toFixed(1)} ({product.reviewsCount} reviews)</span>
//               {product.negotiable && <span className="text-info flex items-center gap-1 text-xs"><Zap size={12} /> Price negotiable</span>}
//             </div>
//           </div>

//           <div className="flex items-baseline gap-2">
//             <span className="text-3xl font-bold text-primary">{formatPKR(product.price)}</span>
//             {hasDiscount && <span className="text-gray-400 line-through text-lg">{formatPKR(product.originalPrice)}</span>}
//             <span className="text-sm text-gray-500">/ {product.unit}</span>
//           </div>

//           <p className={`text-sm font-medium ${outOfStock ? 'text-danger' : 'text-success'}`}>
//             {outOfStock ? 'Out of stock' : `${product.stock} ${product.unit} available`}
//           </p>

//           {!outOfStock && (
//             <div className="flex items-center gap-2 border border-gray-200 rounded-lg w-fit">
//               <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-gray-100 rounded-l-lg"><Minus size={14} /></button>
//               <span className="w-10 text-center text-sm">{qty}</span>
//               <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-2.5 hover:bg-gray-100 rounded-r-lg"><Plus size={14} /></button>
//             </div>
//           )}

//           <div className="flex flex-wrap gap-3">
//             <Button variant="outline" className="flex-1" disabled={outOfStock} onClick={() => handleAddToCart(false)}>
//               <ShoppingCart size={16} /> Add to Cart
//             </Button>
//             <Button variant="primary" className="flex-1" disabled={outOfStock} onClick={() => handleAddToCart(true)}>
//               Buy Now
//             </Button>
//             <button
//               onClick={() => toggleWishlist(product)}
//               className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50"
//               title="Save to wishlist"
//             >
//               <Heart size={18} className={isWishlisted(product.id) ? 'fill-danger text-danger' : 'text-gray-400'} />
//             </button>
//             <button onClick={handleShare} className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50" title="Share">
//               <Share2 size={18} className="text-gray-500" />
//             </button>
//           </div>

//           {/* Seller card */}
//           <Card className="!p-4">
//             <div className="flex items-center justify-between gap-3">
//               <div className="min-w-0">
//                 <p className="text-xs text-gray-400">Sold by</p>
//                 <Link
//                   to={product.sellerId ? `/marketplace/seller/${product.sellerId}` : '#'}
//                   className="font-semibold text-gray-800 hover:text-primary flex items-center gap-1 truncate"
//                 >
//                   {product.sellerName}
//                   {product.sellerVerified && <BadgeCheck size={14} className="text-info shrink-0" />}
//                 </Link>
//                 {product.sellerLocation && (
//                   <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
//                     <MapPin size={11} /> {product.sellerLocation}
//                   </p>
//                 )}
//                 {product.sellerRating != null && (
//                   <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
//                     <Star size={11} className="text-secondary-dark fill-[#ffb703]" /> {Number(product.sellerRating).toFixed(1)} seller rating
//                   </p>
//                 )}
//               </div>
//               <div className="flex gap-2 shrink-0">
//                 {product.sellerId && (
//                   <Link to={`/marketplace/seller/${product.sellerId}`} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
//                     View Store
//                   </Link>
//                 )}
//                 <button
//                   onClick={() => toast('Direct chat needs a messaging backend — not yet available.', { icon: 'ℹ️' })}
//                   className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1"
//                 >
//                   <MessageCircle size={13} /> Chat
//                 </button>
//               </div>
//             </div>
//           </Card>

//           <p className="text-xs text-gray-400 flex items-center gap-1.5">
//             <ShieldCheck size={13} className="text-primary" /> Buyer protection on eligible orders
//           </p>
//         </div>
//       </div>

//       {/* Description */}
//       <Card>
//         <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
//         <p className="text-sm text-gray-600 whitespace-pre-line">{product.description || 'No description provided.'}</p>
//       </Card>

//       {/* Agricultural specifications — only rendered when the backend sent some */}
//       {specEntries.length > 0 && (
//         <Card>
//           <h2 className="font-semibold text-gray-800 mb-3">Specifications</h2>
//           <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
//             {specEntries.map(([key, value]) => (
//               <div key={key} className="flex justify-between border-b border-gray-100 py-1.5">
//                 <dt className="text-gray-500">{specLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}</dt>
//                 <dd className="font-medium text-gray-800">{String(value)}</dd>
//               </div>
//             ))}
//           </dl>
//         </Card>
//       )}

//       {/* Reviews */}
//       <Card>
//         <h2 className="font-semibold text-gray-800 mb-1">Reviews</h2>
//         <p className="text-xs text-gray-400 mb-4">
//           {product.reviewsCount} review{product.reviewsCount === 1 ? '' : 's'} · average {product.rating.toFixed(1)} / 5
//         </p>
//         <form onSubmit={handleSubmitReview} className="space-y-2 border-t pt-4">
//           <p className="text-sm font-medium text-gray-700">Write a review</p>
//           <div className="flex items-center gap-1">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <button type="button" key={i} onClick={() => setReviewRating(i)}>
//                 <Star size={18} className={i <= reviewRating ? 'text-secondary-dark fill-[#ffb703]' : 'text-gray-300 fill-gray-200'} />
//               </button>
//             ))}
//           </div>
//           <textarea
//             className="input-field"
//             rows={3}
//             placeholder="Share your experience with this product..."
//             value={reviewText}
//             onChange={(e) => setReviewText(e.target.value)}
//           />
//           <p className="text-xs text-gray-400">Reviews are only accepted from buyers with a verified purchase of this product.</p>
//           <Button type="submit" variant="primary" size="sm" loading={submittingReview}>Submit Review</Button>
//         </form>
//       </Card>

//       {/* Related products */}
//       {related.length > 0 && (
//         <div>
//           <h2 className="font-semibold text-gray-800 mb-3">Related Products</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {related.map((p) => (
//               <ProductCard
//                 key={p.id}
//                 product={p}
//                 onView={(prod) => navigate(`/marketplace/product/${prod.id}`)}
//                 onAddToCart={() => { addToCart({ productId: p.id, title: p.title, price: p.price, unit: p.unit, qty: 1, sellerId: p.sellerId, sellerName: p.sellerName, image: p.image, imageUrl: p.imageUrl, stock: p.stock }); toast.success(`${p.title} added to cart`) }}
//                 isWishlisted={isWishlisted(p.id)}
//                 onToggleWishlist={toggleWishlist}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Star, ShoppingCart, Heart, Share2, BadgeCheck, MapPin, Minus, Plus,
  Leaf, Zap, ChevronLeft, MessageCircle, ShieldCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import ProductCard from '../components/marketplace/ProductCard'
import useStore from '../store/useStore'
import { marketplaceAPI } from '../services/api'
import { productFromResponse, unwrapList, unwrapOne } from '../utils/marketplaceMapper'
import { formatPKR } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'
import { ErrorState } from './Marketplace'

// Human-readable labels for the free-form `specifications` bag. Any key not
// listed here still renders (title-cased), so nothing gets silently hidden.
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

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await marketplaceAPI.getProductById(id)
      const p = productFromResponse(unwrapOne(res))
      setProduct(p)
      setQty(1)
      setActiveImage(0)

      // Related products: same category, real data, excluding this one.
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

  useEffect(() => { load() }, [id])

  const specEntries = useMemo(() => {
    if (!product?.specifications) return []
    return Object.entries(product.specifications).filter(([, v]) => v !== null && v !== undefined && v !== '')
  }, [product])

  if (loading) {
    return <div className="py-24 flex justify-center"><Loader label="Loading product..." /></div>
  }
  if (error || !product) {
    return <ErrorState message={error || 'Product not found'} onRetry={load} />
  }

  const outOfStock = (product.stock ?? 0) <= 0
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const images = product.images?.length ? product.images : null

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
    if (goToCart) navigate('/marketplace/checkout')
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
      toast.error('Please write a short review')
      return
    }
    setSubmittingReview(true)
    try {
      await marketplaceAPI.addProductReview(product.id, { rating: reviewRating, comment: reviewText })
      toast.success('Review submitted')
      setReviewText('')
      load()
    } catch (err) {
      // Backend enforces "verified purchase only" — surface whatever it says.
      toast.error(getApiErrorMessage(err, { 404: 'Product not found.' }))
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gallery */}
        <div>
          <div className="relative h-80 sm:h-96 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-8xl overflow-hidden">
            {images ? (
              <img src={images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              product.image
            )}
            {hasDiscount && (
              <span className="absolute top-3 left-3 bg-danger text-white text-xs font-bold px-2.5 py-1 rounded">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
          {images && images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImage === i ? 'border-primary' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {product.videoUrl && (
            <video src={product.videoUrl} controls className="w-full mt-3 rounded-xl" />
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{product.title}</h1>
              {product.organic && <span className="badge badge-success flex items-center gap-1"><Leaf size={11} /> Organic</span>}
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className={i <= Math.round(product.rating) ? 'text-secondary-dark fill-[#ffb703]' : 'text-gray-300 fill-gray-200'} />
                ))}
              </div>
              <span className="text-gray-500">{product.rating.toFixed(1)} ({product.reviewsCount} reviews)</span>
              {product.negotiable && <span className="text-info flex items-center gap-1 text-xs"><Zap size={12} /> Price negotiable</span>}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{formatPKR(product.price)}</span>
            {hasDiscount && <span className="text-gray-400 line-through text-lg">{formatPKR(product.originalPrice)}</span>}
            <span className="text-sm text-gray-500">/ {product.unit}</span>
          </div>

          <p className={`text-sm font-medium ${outOfStock ? 'text-danger' : 'text-success'}`}>
            {outOfStock ? 'Out of stock' : `${product.stock} ${product.unit} available`}
          </p>

          {!outOfStock && (
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg w-fit">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-gray-100 rounded-l-lg"><Minus size={14} /></button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-2.5 hover:bg-gray-100 rounded-r-lg"><Plus size={14} /></button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex-1" disabled={outOfStock} onClick={() => handleAddToCart(false)}>
              <ShoppingCart size={16} /> Add to Cart
            </Button>
            <Button variant="primary" className="flex-1" disabled={outOfStock} onClick={() => handleAddToCart(true)}>
              Buy Now
            </Button>
            <button
              onClick={() => toggleWishlist(product)}
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50"
              title="Save to wishlist"
            >
              <Heart size={18} className={isWishlisted(product.id) ? 'fill-danger text-danger' : 'text-gray-400'} />
            </button>
            <button onClick={handleShare} className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50" title="Share">
              <Share2 size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Seller card */}
          <Card className="!p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-400">Sold by</p>
                <Link
                  to={product.sellerId ? `/marketplace/seller/${product.sellerId}` : '#'}
                  className="font-semibold text-gray-800 hover:text-primary flex items-center gap-1 truncate"
                >
                  {product.sellerName}
                  {product.sellerVerified && <BadgeCheck size={14} className="text-info shrink-0" />}
                </Link>
                {product.sellerLocation && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {product.sellerLocation}
                  </p>
                )}
                {product.sellerRating != null && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Star size={11} className="text-secondary-dark fill-[#ffb703]" /> {Number(product.sellerRating).toFixed(1)} seller rating
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                {product.sellerId && (
                  <Link to={`/marketplace/seller/${product.sellerId}`} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                    View Store
                  </Link>
                )}
                <button
                  onClick={() => toast('Direct chat needs a messaging backend — not yet available.', { icon: 'ℹ️' })}
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                >
                  <MessageCircle size={13} /> Chat
                </button>
              </div>
            </div>
          </Card>

          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-primary" /> Buyer protection on eligible orders
          </p>
        </div>
      </div>

      {/* Description */}
      <Card>
        <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
        <p className="text-sm text-gray-600 whitespace-pre-line">{product.description || 'No description provided.'}</p>
      </Card>

      {/* Agricultural specifications — only rendered when the backend sent some */}
      {specEntries.length > 0 && (
        <Card>
          <h2 className="font-semibold text-gray-800 mb-3">Specifications</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {specEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-gray-100 py-1.5">
                <dt className="text-gray-500">{specLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}</dt>
                <dd className="font-medium text-gray-800">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      {/* Reviews */}
      <Card>
        <h2 className="font-semibold text-gray-800 mb-1">Reviews</h2>
        <p className="text-xs text-gray-400 mb-4">
          {product.reviewsCount} review{product.reviewsCount === 1 ? '' : 's'} · average {product.rating.toFixed(1)} / 5
        </p>
        <form onSubmit={handleSubmitReview} className="space-y-2 border-t pt-4">
          <p className="text-sm font-medium text-gray-700">Write a review</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button type="button" key={i} onClick={() => setReviewRating(i)}>
                <Star size={18} className={i <= reviewRating ? 'text-secondary-dark fill-[#ffb703]' : 'text-gray-300 fill-gray-200'} />
              </button>
            ))}
          </div>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Share your experience with this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <p className="text-xs text-gray-400">Reviews are only accepted from buyers with a verified purchase of this product.</p>
          <Button type="submit" variant="primary" size="sm" loading={submittingReview}>Submit Review</Button>
        </form>
      </Card>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={(prod) => navigate(`/marketplace/product/${prod.id}`)}
                onAddToCart={() => { addToCart({ productId: p.id, title: p.title, price: p.price, unit: p.unit, qty: 1, sellerId: p.sellerId, sellerName: p.sellerName, image: p.image, imageUrl: p.imageUrl, stock: p.stock }); toast.success(`${p.title} added to cart`) }}
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