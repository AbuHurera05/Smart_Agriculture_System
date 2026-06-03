import { useState } from 'react'
import { Bell, User, Search, Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { useAuthContext } from '../../context/AuthContext'

export default function Header() {
  const navigate = useNavigate()
  const { logout, user } = useAuthContext()
  const { sidebarOpen, toggleSidebar, notifications, clearNotifications } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search crops, advice, or news..." 
              className="bg-transparent px-2 py-1 outline-none text-sm w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications)
                if (showNotifications) setShowProfile(false)
              }}
              className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
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
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div key={idx} className="p-3 hover:bg-gray-50 border-b last:border-0">
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
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
              className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Farmer'}</p>
              </div>
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <div className="mt-1">
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
                  onClick={() => navigate('/profile')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  Profile Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} />
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