import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Sun,
  Moon,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Sprout,
} from 'lucide-react'
import useStore from '../../store/useStore'
import { useAuthContext } from '../../context/AuthContext'
import FarmerAvatar from '../common/FarmerAvatar'
import Button from '../common/Button'

export default function PublicLayout({ children }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthContext()
  const { darkMode, toggleDarkMode, cartItems } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Live Weather', path: '/weather' },
    { label: 'Crop Advisory', path: '/crop-guide' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-night dark:text-white transition-colors duration-200">
      {/* =========================================================
          PUBLIC STICKY NAVBAR (No Dashboard Sidebar)
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-night-raised/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <FarmerAvatar size={40} withRing={true} animated={false} />
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

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                    isActive
                      ? 'text-emerald-600 font-bold dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Shopping Cart Button */}
            <Link
              to="/marketplace/cart"
              className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-night-card dark:text-white transition-all"
            >
              <ShoppingCart size={17} className="text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth CTA Button */}
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight size={14} />}
                className="!text-xs !py-2 hidden sm:inline-flex"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/login')}
                className="!text-xs !py-2 hidden sm:inline-flex"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-night-raised lg:hidden animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-emerald-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-white/5">
                {isAuthenticated ? (
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/dashboard')
                    }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/login')
                    }}
                  >
                    Sign In / Register
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* =========================================================
          MAIN PUBLIC CONTENT AREA (Full Width, No Sidebar)
      ========================================================= */}
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          {children}
        </div>
      </main>

      {/* =========================================================
          PUBLIC FOOTER
      ========================================================= */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-white/10 dark:bg-night transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Founders */}
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
              <div className="pt-1 space-y-1 text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300">Founders &amp; Team:</p>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong className="text-emerald-700 dark:text-emerald-400">Abu Hurera Junejo</strong> (Roll No: <span className="font-mono font-semibold">2K23/BLCS/05</span>)
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong className="text-amber-700 dark:text-amber-400">Abrar Ali</strong> (Roll No: <span className="font-mono font-semibold">2K23/BLCS/03</span>)
                </p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><Link to="/marketplace" className="hover:text-emerald-600 transition-colors">Marketplace Catalog</Link></li>
                <li><Link to="/weather" className="hover:text-emerald-600 transition-colors">Live Weather Forecast</Link></li>
                <li><Link to="/crop-guide" className="hover:text-emerald-600 transition-colors">Crop Farming Guide</Link></li>
                <li><Link to="/about" className="hover:text-emerald-600 transition-colors">About AsanKisan Story</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-600 transition-colors">Contact Support &amp; Helpline</Link></li>
              </ul>
            </div>

            {/* Column 3: Smart IoT Ecosystem */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Smart IoT Hardware
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>ESP32 Master Node</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Capacitive Soil Moisture Probe</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>DHT22 Climate Sensor</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Raindrop Precipitation Sensor</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Water Reservoir Depth Probe</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Automatic Pump Motor Relay</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Farmer Helpline & Contact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Farmer Helpline &amp; Inquiries
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-600 shrink-0" />
                  <a href="tel:03242938640" className="font-semibold hover:underline">03242938640</a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-green-600 shrink-0" />
                  <a
                    href="https://wa.me/923242938640"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-semibold text-green-700 dark:text-green-400"
                  >
                    WhatsApp (03242938640)
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-emerald-600 shrink-0" />
                  <a href="mailto:smaratgriculture076@gmail.com" className="hover:underline truncate">smaratgriculture076@gmail.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-600 shrink-0" />
                  <span>Ward 1 Tando Bago</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <p>© {new Date().getFullYear()} AsanKisan (آسان کسان). All rights reserved.</p>
            <p className="mt-2 sm:mt-0 font-medium">Built with ❤️ for Pakistan's Agricultural Community</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
