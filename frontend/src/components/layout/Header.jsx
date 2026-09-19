import { useState } from 'react'
import { Bell, User, Search, Menu, LogOut, Sun, Moon, Settings, UserCircle, ShoppingCart, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { useAuthContext } from '../../context/AuthContext'

export default function Header() {
  const navigate = useNavigate()
  const { logout, user } = useAuthContext()
  const { toggleMobileSidebar, notifications, clearNotifications, darkMode, toggleDarkMode, cartItems, wishlist } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white/90 dark:bg-[#0e1712]/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0"
          >
            <Menu size={22} />
          </button>

          <div className="hidden md:flex items-center bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-gray-200 dark:border-white/10 w-64 lg:w-80">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search sensors, crops, advice..."
              className="bg-transparent px-2 py-0.5 outline-none text-sm w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Marketplace: Wishlist */}
          <button
            onClick={() => navigate('/marketplace/wishlist')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg relative transition-colors"
            title="Wishlist"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Marketplace: Cart */}
          <button
            onClick={() => navigate('/marketplace/cart')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg relative transition-colors"
            title="Cart"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                if (showNotifications) setShowProfile(false)
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg relative transition-colors"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse ring-2 ring-white dark:ring-[#0e1712]"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#142019] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 z-50 animate-scale-in origin-top-right">
                <div className="p-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div key={idx} className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-white/10 last:border-0">
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile)
                if (showProfile) setShowNotifications(false)
              }}
              className="flex items-center gap-2 p-1 pr-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-light to-primary rounded-full flex items-center justify-center text-white overflow-hidden shrink-0">
                {user?.avatarImage ? (
                  <img src={user.avatarImage} alt="avatar" className="w-full h-full object-cover" />
                ) : user?.avatar ? (
                  <span className="text-sm">{user.avatar}</span>
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-tight">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize leading-tight">{user?.role || 'Farmer'}</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#142019] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 z-50 animate-scale-in origin-top-right overflow-hidden">
                <div className="p-3 border-b border-gray-100 dark:border-white/10">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  <div className="mt-1.5">
                    <span className={`badge ${
                      user?.role === 'admin' ? 'badge-danger' :
                      user?.role === 'expert' ? 'badge-info' : 'badge-success'
                    } text-xs`}>
                      {user?.role === 'admin' ? 'Administrator' :
                       user?.role === 'expert' ? 'Agricultural Expert' : 'Verified Farmer'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { navigate('/profile'); setShowProfile(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <UserCircle size={16} /> My Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setShowProfile(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <Settings size={16} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 border-t border-gray-100 dark:border-white/10"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}