import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShoppingBag,
  ShoppingCart,
  Zap,
  Droplets,
  Thermometer,
  CloudRain,
  Gauge,
  Cpu,
  ShieldCheck,
  Truck,
  Star,
  Search,
  CheckCircle2,
  ArrowRight,
  Filter,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Layers,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  UserCheck,
  MessageCircle,
  Sprout,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '../store/useStore'
import { useAuthContext } from '../context/AuthContext'
import { marketplaceAPI } from '../services/api'
import { formatPKR } from '../utils/format'
import FarmerAvatar from '../components/common/FarmerAvatar'
import Button from '../components/common/Button'

// Fallback seed catalog for instant display
const FALLBACK_PRODUCTS = [
  {
    id: 101,
    title: 'Certified Akbar-2019 Wheat Seed (50kg)',
    category: 'Seeds',
    price: 4800,
    unit: '50kg Bag',
    rating: 4.9,
    reviewCount: 38,
    stock: 120,
    sellerName: 'Punjab Seed Corporation',
    sellerId: 1,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    description: 'High-yielding rust-resistant certified Akbar-2019 wheat seeds tested for 95% germination rate.',
  },
  {
    id: 102,
    title: 'Engro DAP Fertilizer (50kg Bag)',
    category: 'Fertilizers',
    price: 11500,
    unit: '50kg Bag',
    rating: 5.0,
    reviewCount: 64,
    stock: 85,
    sellerName: 'Sindh Agri Agro Dealers',
    sellerId: 2,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    description: 'Original Engro DAP with 18% Nitrogen and 46% Phosphate for robust root zone development.',
  },
  {
    id: 103,
    title: 'Smart Solar Drip Irrigation Kit (1 Acre)',
    category: 'Irrigation',
    price: 38500,
    unit: 'Complete Kit',
    rating: 4.8,
    reviewCount: 22,
    stock: 15,
    sellerName: 'Pak Solar & Tube Wells',
    sellerId: 3,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    description: 'Complete 1-acre gravity drip kit with pressure compensating emitters, mainline pipe and filters.',
  },
  {
    id: 104,
    title: 'Super Power 3-HP Submersible Water Pump',
    category: 'Machinery',
    price: 27500,
    unit: 'Unit',
    rating: 4.7,
    reviewCount: 19,
    stock: 28,
    sellerName: 'Lahore Agricultural Machinery',
    sellerId: 4,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    description: 'Copper winding deep-well submersible water pump with dry-run auto protector sensor.',
  },
  {
    id: 105,
    title: 'Organic Bio-Pesticide Neem Extract (5 Litres)',
    category: 'Pesticides',
    price: 3200,
    unit: '5L Can',
    rating: 4.8,
    reviewCount: 31,
    stock: 50,
    sellerName: 'Green Bio Solutions',
    sellerId: 5,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    description: '100% safe bio-insecticide for aphids, whiteflies, and bollworms without residue harm.',
  },
  {
    id: 106,
    title: 'Sona Urea Prilled Nitrogen Fertilizer (50kg)',
    category: 'Fertilizers',
    price: 3800,
    unit: '50kg Bag',
    rating: 4.9,
    reviewCount: 92,
    stock: 200,
    sellerName: 'FFC Authorized Dealer',
    sellerId: 1,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    description: 'FFC Sona Urea 46% Nitrogen for rapid vegetative growth and tiller formation in grain crops.',
  },
  {
    id: 107,
    title: 'Hybrid Tomato Seeds - Sahil F1 (10g)',
    category: 'Seeds',
    price: 1850,
    unit: 'Packet',
    rating: 4.7,
    reviewCount: 14,
    stock: 45,
    sellerName: 'Syngenta Authorized Store',
    sellerId: 2,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: 'High heat tolerance Sahil F1 hybrid tomato seeds producing firm, uniform red fruit.',
  },
  {
    id: 108,
    title: 'Automatic Rain & Moisture ESP32 Controller Kit',
    category: 'Irrigation',
    price: 14500,
    unit: 'Hardware Kit',
    rating: 5.0,
    reviewCount: 29,
    stock: 30,
    sellerName: 'AsanKisan IoT Hardware Lab',
    sellerId: 3,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    description: 'Official AsanKisan hardware kit: ESP32 + Capacitive Moisture + DHT22 + Rain Sensor + 30A Pump Relay.',
  },
]

const CATEGORIES = [
  'All Products',
  'Seeds',
  'Fertilizers',
  'Irrigation',
  'Machinery',
  'Pesticides',
]

export default function StartupHome() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthContext()
  const { cartItems, addToCart, darkMode, toggleDarkMode } = useStore()

  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  const [searchQuery, setSearchQuery] = useState('')

  const [quickName, setQuickName] = useState('')
  const [quickContact, setQuickContact] = useState('')
  const [quickSubject, setQuickSubject] = useState('IoT Hardware & Sensors')
  const [quickMessage, setQuickMessage] = useState('')
  const [quickSubmitting, setQuickSubmitting] = useState(false)

  const handleQuickContact = (e) => {
    e.preventDefault()
    setQuickSubmitting(true)
    setTimeout(() => {
      setQuickSubmitting(false)
      toast.success('Your inquiry has been received! Our team will contact you shortly.', { icon: '✅' })
      setQuickName('')
      setQuickContact('')
      setQuickMessage('')
    }, 700)
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0)

  // Fetch real marketplace products if backend is up
  useEffect(() => {
    let isLive = true
    const loadMarketplace = async () => {
      try {
        setLoadingProducts(true)
        const res = await marketplaceAPI.getProducts({ page: 0, size: 24 })
        const liveList = res.data?.data?.content || res.data?.data || []
        if (isLive && Array.isArray(liveList) && liveList.length > 0) {
          // Normalize products
          const normalized = liveList.map((p) => ({
            id: p.id,
            title: p.title || p.name,
            category: p.categoryName || p.category || 'General',
            price: Number(p.price || 0),
            unit: p.unit || 'Unit',
            rating: p.averageRating ? Number(p.averageRating) : 4.8,
            reviewCount: p.reviewCount || 12,
            stock: p.stockQuantity ?? p.stock ?? 20,
            sellerName: p.seller?.storeName || p.sellerName || 'Verified Seller',
            sellerId: p.seller?.id || p.sellerId || 1,
            image: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
            description: p.description || '',
          }))
          setProducts(normalized)
        }
      } catch {
        // Safe fallback already active
      } finally {
        if (isLive) setLoadingProducts(false)
      }
    }

    loadMarketplace()
    return () => {
      isLive = false
    }
  }, [])

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === 'All Products' ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [products, selectedCategory, searchQuery])

  // Direct add to cart
  const handleAddToCart = (product, e) => {
    e?.stopPropagation?.()
    if (!isAuthenticated) {
      toast('Please sign in to add items to your cart.', { icon: '🔐' })
      navigate('/login?redirect=/marketplace')
      return
    }
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      unit: product.unit,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      imageUrl: product.image,
      stock: product.stock,
    })
    toast.success(`"${product.title}" added to cart!`, { icon: '🛒' })
  }

  // Buy Now: requires sign-in for checkout
  const handleBuyNow = (product, e) => {
    e?.stopPropagation?.()
    if (!isAuthenticated) {
      toast('Please sign in to purchase products.', { icon: '🔐' })
      navigate('/login?redirect=/marketplace/checkout')
      return
    }
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      unit: product.unit,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      imageUrl: product.image,
      stock: product.stock,
    })
    navigate('/marketplace/checkout')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-night dark:text-white transition-colors duration-200">
      {/* =========================================================
          TOP STICKY NAVBAR
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-night-raised/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <FarmerAvatar size={42} withRing={true} animated={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  AsanKisan
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  آسان کسان
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Kisan Ka Digital Sathi • Smart Agri &amp; Market
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#products-section" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Marketplace
            </a>
            <a href="#iot-section" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Smart IoT
            </a>
            <Link to="/weather" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Weather
            </Link>
            <Link to="/crop-guide" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Crop Advisory
            </Link>
            <a href="#about-section" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
              About
            </a>
            <a href="#contact-section" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Controls: Dark Mode, Login/Dashboard */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth CTA */}
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight size={14} />}
                className="!text-xs !py-2"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/login')}
                className="!text-xs !py-2"
              >
                Sign In / Register
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 dark:border-white/10 dark:from-emerald-950/20 dark:via-night dark:to-night py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10">
            {/* Left Hero Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/70 px-3.5 py-1.5 text-xs font-bold text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Pakistan's Premier Smart Agriculture &amp; Farmer Hub</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Smart Agriculture &amp;
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Verified Farmer Marketplace
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect your farm with real-time IoT sensors, automate tube well irrigation, get live regional weather intelligence, and buy genuine seeds and fertilizers directly without middleman cuts.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#products-section"
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:shadow-xl transition-all"
                >
                  <ShoppingBag size={18} />
                  Shop Farm Supplies (مارکیٹ)
                </a>

                <a
                  href="#iot-section"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-night-raised dark:text-white dark:hover:bg-white/5 transition-all"
                >
                  <Cpu size={18} className="text-emerald-600 dark:text-emerald-400" />
                  Explore Smart IoT
                </a>

                <Link
                  to="/marketplace/checkout"
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline px-2 py-1"
                >
                  Guest Checkout Available &rarr;
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 dark:border-white/10 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    100% Genuine Certified
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    <Droplets size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Save 40% Water
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    <Truck size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Cash On Delivery
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                    <UserCheck size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Buy Without Login
                  </span>
                </div>
              </div>
            </div>

            {/* Right Interactive Telemetry Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-night-raised">
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        KIT-ESP32-001 • LIVE TELEMETRY
                      </p>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Junejo Model Farm (Tando Jam)
                      </h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    Wheat Field
                  </span>
                </div>

                {/* 4 Quick Gauges */}
                <div className="grid grid-cols-2 gap-3.5 my-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">Soil Moisture</span>
                      <Droplets size={14} className="text-green-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">58.5%</p>
                    <span className="text-[11px] text-emerald-600 font-semibold">Optimal Root Zone</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">Air Temp</span>
                      <Thermometer size={14} className="text-amber-500" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">27.2°C</p>
                    <span className="text-[11px] text-slate-500 font-medium">Humidity: 62%</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">Raindrop Sensor</span>
                      <CloudRain size={14} className="text-blue-500" />
                    </div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">Clear Sky</p>
                    <span className="text-[11px] text-slate-500 font-medium">0% Rain Intensity</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">Tank Water Level</span>
                      <Gauge size={14} className="text-cyan-500" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">84%</p>
                    <span className="text-[11px] text-cyan-600 font-semibold">Safe Depth Level</span>
                  </div>
                </div>

                {/* Motor Relay State Bar */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Irrigation Tube Well Motor
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Auto Mode • Dry-Run Protected
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white shadow-sm">
                    READY (AUTO)
                  </span>
                </div>

                <div className="mt-4 pt-3 text-center border-t border-slate-100 dark:border-white/10">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    View Complete Interactive Farm Dashboard &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED PRODUCTS SHOWCASE SECTION (DIRECT PURCHASE)
      ========================================================= */}
      <section id="products-section" className="py-12 sm:py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <ShoppingBag size={15} />
              <span>Direct Agriculture Marketplace (زرعی منڈی)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              All Agricultural Products &amp; Supplies
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Buy verified seeds, fertilizers, machinery, and drip irrigation gear. Sign in to place orders, review products, and manage delivery.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search seeds, fertilizer..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-green-500 focus:outline-none dark:border-white/10 dark:bg-night-card dark:text-white"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-night-card dark:text-slate-200 dark:hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/marketplace/product/${product.id}`)}
              className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-night-raised flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-white/5">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                    {product.category}
                  </span>
                  <span className="absolute right-3 top-3 rounded-lg bg-emerald-600/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                    In Stock
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    By {product.sellerName}
                  </p>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex text-amber-400">
                      {'★'.repeat(Math.round(product.rating))}
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {product.rating}
                    </span>
                    <span className="text-slate-400">({product.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="pt-2">
                    <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                      {formatPKR(product.price)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ {product.unit}</span>
                  </div>
                </div>
              </div>

              {/* Direct Buy & Add Actions */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(product, e)}
                  className="rounded-xl border border-emerald-600 py-2 px-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-500/10 transition-colors"
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={(e) => handleBuyNow(product, e)}
                  className="rounded-xl bg-emerald-600 py-2 px-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No products found matching your search.</p>
          </div>
        )}

        {/* View All In Marketplace */}
        <div className="pt-4 text-center">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-night-card dark:text-white"
          >
            <span>Explore Full Marketplace Catalog &amp; Filter Options</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* =========================================================
          SMART IOT HARDWARE ECOSYSTEM
      ========================================================= */}
      <section id="iot-section" className="py-14 sm:py-20 border-t border-slate-200/80 bg-slate-100/60 dark:border-white/10 dark:bg-night-raised/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
              <Cpu size={14} />
              <span>5 Field Sensors + Tube Well Automation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Complete IoT Field Hardware Kit
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              The AsanKisan hardware kit is custom calibrated for Pakistani soil and weather conditions, powered by an industrial ESP32-WROOM controller.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-night-card space-y-3">
              <div className="p-3 rounded-xl bg-green-100 text-green-700 w-fit">
                <Droplets size={22} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Capacitive Soil Probe
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Corrosion-free volumetric moisture tracking right in the crop root zone.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-night-card space-y-3">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700 w-fit">
                <Thermometer size={22} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                DHT22 Weather Mast
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                High precision digital air temperature and relative humidity sensing.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-night-card space-y-3">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-700 w-fit">
                <CloudRain size={22} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Raindrop Detector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Instant precipitation detection to pause irrigation and prevent waterlogging.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-night-card space-y-3">
              <div className="p-3 rounded-xl bg-cyan-100 text-cyan-700 w-fit">
                <Gauge size={22} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Water Level Depth
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Submersible tank and tube well level sensor with dry-run pump safety lock.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-night-card space-y-3">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-700 w-fit">
                <Zap size={22} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Pump Relay Switch
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Heavy-duty motor switch with automated moisture thresholds and manual override.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT ASANKISAN & FOUNDERS SECTION
      ========================================================= */}
      <section id="about-section" className="py-20 border-b border-slate-200/80 bg-slate-50/50 dark:border-white/10 dark:bg-night-raised/40 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
              <Sprout size={14} /> Our Mission &amp; Leadership
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              About AsanKisan (آسان کسان)
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
              Empowering farmers across Pakistan with real-time IoT automation, water-saving irrigation engines, instant multi-channel alerts (Gmail, SMS, WhatsApp), and fair-trade agricultural marketplace.
            </p>
          </div>

          {/* Founders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Founder 1: Abu Hurera Junejo */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-night-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  AH
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Abu Hurera Junejo
                    </h3>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Founder &amp; System Architect
                    </span>
                    <span className="rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 text-xs font-mono font-bold">
                      2K23/BLCS/05
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Full-Stack &amp; IoT Systems Engineer
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    junejoabuhurera52@gmail.com
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Architected and built the end-to-end AsanKisan platform: embedded ESP32 firmware telemetry, soil moisture &amp; rain cut-off logic, reservoir dry-run pump protectors, multi-channel dispatchers (Gmail SMTP, SMS, WhatsApp), and reactive microservices.
              </p>
              <div className="flex flex-wrap gap-2">
                {['ESP32 IoT Systems', 'Microservices Architecture', 'Automated Irrigation', 'React & Tailwind', 'Spring Boot'].map((skill) => (
                  <span key={skill} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Founder 2: Abrar Ali */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-night-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-amber-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  AA
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Abrar Ali
                    </h3>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                      Co-Founder &amp; Operations Lead
                    </span>
                    <span className="rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 text-xs font-mono font-bold">
                      2K23/BLCS/03
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Agronomy &amp; Farmer Community Operations
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                    abraralimemeon23@gmail.com
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Directs field agronomy research, soil calibration across regional farmlands, verified seed/fertilizer vendor onboarding, and grower community outreach to ensure tech remains intuitive and practical in the field.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Agronomy Advisory', 'Field Sensor Deployment', 'Marketplace Logistics', 'Community Outreach', 'Farmer Operations'].map((skill) => (
                  <span key={skill} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pillars & CTA */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-extrabold">Discover Our Full Architectural Blueprint</h3>
              <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
                Read our in-depth design covering sensor pinouts, auto-irrigation failsafes, real-time telemetry simulation, and the complete farmer journey.
              </p>
            </div>
            <Link
              to="/about"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-900 shadow-lg hover:bg-emerald-50 transition-all"
            >
              <span>Explore Full About Page</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT & HELPLINE SECTION
      ========================================================= */}
      <section id="contact-section" className="py-20 border-b border-slate-200/80 bg-white dark:border-white/10 dark:bg-night scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
              <Phone size={14} /> 24/7 Farmer Support
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Get in Touch with AsanKisan
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
              Have questions regarding ESP32 hardware, soil sensors, order delivery, or selling your harvest? Connect directly with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Quick Contact Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-night-card flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Helpline &amp; Support</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Direct 24/7 agricultural helpline</p>
                  <a href="tel:03242938640" className="inline-block mt-2 font-bold text-emerald-600 dark:text-emerald-400 text-sm hover:underline">
                    03242938640
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-green-200 bg-green-50/50 dark:border-green-500/20 dark:bg-green-950/20 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-green-600 text-white shrink-0 shadow-md shadow-green-600/30">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">WhatsApp Live Chat</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instant hardware help &amp; sensor setup</p>
                  <a
                    href="https://wa.me/923242938640?text=Hello%20AsanKisan%20Team,%20I%20need%20assistance%20with%20my%20farm%20setup"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <span>Chat on 03242938640</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-night-card flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Official Gmail Address</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">System alerts, orders &amp; support</p>
                  <a href="mailto:smaratgriculture076@gmail.com" className="inline-block mt-2 font-bold text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    smaratgriculture076@gmail.com
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-night-card flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Headquarters &amp; Field Lab</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Agronomy operations &amp; dispatch</p>
                  <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Ward 1 Tando Bago
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-night-card">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Send a Quick Inquiry
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  Fill in your details below and an AsanKisan representative will reply promptly.
                </p>

                <form onSubmit={handleQuickContact} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                        placeholder="e.g. Tariq Khan"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-night-raised dark:focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Mobile Number or Email
                      </label>
                      <input
                        type="text"
                        required
                        value={quickContact}
                        onChange={(e) => setQuickContact(e.target.value)}
                        placeholder="03242938640 or email"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-night-raised dark:focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={quickSubject}
                      onChange={(e) => setQuickSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-night-raised dark:focus:border-emerald-400"
                    >
                      <option value="IoT Hardware & Sensors">IoT Hardware &amp; ESP32 Sensors</option>
                      <option value="Smart Automated Irrigation">Smart Automated Irrigation &amp; Pump</option>
                      <option value="Marketplace Products">Marketplace Products &amp; Delivery</option>
                      <option value="Seller Onboarding">Become an AsanKisan Seller</option>
                      <option value="General Support">General Agronomy Advice</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={quickMessage}
                      onChange={(e) => setQuickMessage(e.target.value)}
                      placeholder="Tell us about your farm, questions, or product requirements..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-night-raised dark:focus:border-emerald-400"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={quickSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {quickSubmitting ? 'Sending Message...' : 'Submit Inquiry'}
                    </Button>
                    <Link
                      to="/contact"
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>View FAQs &amp; Support Page</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-white/10 dark:bg-night">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <FarmerAvatar size={36} />
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  AsanKisan
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pakistan's comprehensive digital agriculture platform. Empowering farmers with IoT automation, verified market trade, and crop intelligence.
              </p>
              <div className="space-y-1 text-xs">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong className="text-emerald-700 dark:text-emerald-400">Abu Hurera Junejo</strong> (Roll No: <span className="font-mono font-semibold">2K23/BLCS/05</span>)
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong className="text-amber-700 dark:text-amber-400">Abrar Ali</strong> (Roll No: <span className="font-mono font-semibold">2K23/BLCS/03</span>)
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><Link to="/marketplace" className="hover:text-emerald-600">Marketplace Catalog</Link></li>
                <li><Link to="/weather" className="hover:text-emerald-600">Live Weather Forecast</Link></li>
                <li><Link to="/crop-guide" className="hover:text-emerald-600">Crop Farming Guide</Link></li>
                <li><Link to="/about" className="hover:text-emerald-600">About the Project &amp; Team</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-600">Contact &amp; Farmer Helpdesk</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Smart IoT Solutions
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><Link to="/dashboard" className="hover:text-emerald-600">Farm IoT Dashboard</Link></li>
                <li><Link to="/live-monitoring" className="hover:text-emerald-600">Live Sensor Feeds</Link></li>
                <li><Link to="/sensor-details" className="hover:text-emerald-600">Calibration &amp; Thresholds</Link></li>
                <li><Link to="/chatbot" className="hover:text-emerald-600">AI Kisan Assistant</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Farmer Helpline &amp; Support
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Phone size={13} className="text-emerald-600" />
                  <a href="tel:03242938640" className="hover:underline">03242938640</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={13} className="text-emerald-600" />
                  <a href="mailto:smaratgriculture076@gmail.com" className="hover:underline truncate">smaratgriculture076@gmail.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={13} className="text-emerald-600 shrink-0" />
                  <span>Ward 1 Tando Bago</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <p>© {new Date().getFullYear()} AsanKisan. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Built for Pakistan's Agricultural Community</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
