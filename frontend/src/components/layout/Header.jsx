import { useState, useRef, useEffect } from 'react'
import {
  Bell,
  User,
  Search,
  Menu,
  LogOut,
  Sun,
  Moon,
  Settings,
  UserCircle,
  ShoppingCart,
  Heart,
  ChevronDown,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { useAuthContext } from '../../context/AuthContext'

export default function Header() {
  const navigate = useNavigate()
  const { logout, user } = useAuthContext()
  const {
    toggleMobileSidebar,
    notifications,
    clearNotifications,
    darkMode,
    toggleDarkMode,
    cartItems,
    wishlist,
  } = useStore()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleBadge = () => {
    const role = user?.role?.toLowerCase()
    if (role === 'admin') return { label: 'Administrator', style: 'bg-red-50 text-red-600 ring-red-500/20' }
    if (role === 'expert') return { label: 'Agricultural Expert', style: 'bg-blue-50 text-blue-600 ring-blue-500/20' }
    return { label: 'Verified Farmer', style: 'bg-green-50 text-green-600 ring-green-500/20' }
  }

  const roleBadge = getRoleBadge()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-[#0e1712]/80">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">

        {/* LEFT — Menu + Search */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            className="shrink-0 rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="hidden w-64 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 transition-all focus-within:border-green-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-500/10 md:flex lg:w-80 dark:border-white/10 dark:bg-white/5 dark:focus-within:bg-white/10">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search sensors, crops, advice..."
              className="w-full bg-transparent py-0.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
            <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 lg:block dark:border-white/10 dark:bg-white/10">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* RIGHT — Actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">

          {/* Wishlist */}
          <button
            onClick={() => navigate('/marketplace/wishlist')}
            className="group relative rounded-xl p-2 text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            title="Wishlist"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#0e1712]">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate('/marketplace/cart')}
            className="group relative rounded-xl p-2 text-slate-600 transition-colors hover:bg-green-50 hover:text-green-600 dark:text-slate-300 dark:hover:bg-green-500/10 dark:hover:text-green-400"
            title="Cart"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#0e1712]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications((v) => !v)
                setShowProfile(false)
              }}
              className="relative rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              title="Notifications"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0e1712]" />
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-black/5 dark:border-white/10 dark:bg-[#142019]">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/10">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs font-semibold text-green-600 transition-colors hover:text-green-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                        <Bell className="h-5 w-5 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        No notifications yet
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        We'll notify you when something arrives
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div
                        key={idx}
                        className="cursor-pointer border-b border-slate-100 px-4 py-3 transition-colors last:border-0 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                            <Bell size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {notif.title}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                              {notif.message}
                            </p>
                            <p className="mt-1 text-[11px] font-medium text-slate-400">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile((v) => !v)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-sm ring-2 ring-white dark:ring-[#0e1712]">
                {user?.avatarImage ? (
                  <img
                    src={user.avatarImage}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : user?.avatar ? (
                  <span className="text-sm font-bold">{user.avatar}</span>
                ) : (
                  <User size={16} />
                )}
              </div>

              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] font-medium capitalize leading-tight text-slate-500 dark:text-slate-400">
                  {user?.role || 'Farmer'}
                </p>
              </div>

              <ChevronDown
                size={14}
                className={`hidden text-slate-400 transition-transform md:block ${
                  showProfile ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-black/5 dark:border-white/10 dark:bg-[#142019]">
                {/* User info */}
                <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-white/10 dark:from-white/5 dark:to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-md">
                      {user?.avatarImage ? (
                        <img
                          src={user.avatarImage}
                          alt="avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {user?.name || 'User'}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${roleBadge.style}`}
                    >
                      {roleBadge.label}
                    </span>
                  </div>
                </div>

                {/* Menu */}
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      navigate('/profile')
                      setShowProfile(false)
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    <UserCircle size={16} className="text-slate-400" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate('/settings')
                      setShowProfile(false)
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    <Settings size={16} className="text-slate-400" />
                    Settings
                  </button>

                  <div className="my-1 h-px bg-slate-100 dark:bg-white/10" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}