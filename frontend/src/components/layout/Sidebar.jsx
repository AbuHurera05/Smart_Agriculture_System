import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Radio,
  Gauge,
  Sprout,
  CloudRain,
  ShoppingBag,
  MessageCircle,
  UserCircle,
  Settings as SettingsIcon,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Leaf,
  X,
} from 'lucide-react'
import useStore from '../../store/useStore'
import { useAuthContext } from '../../context/AuthContext'

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/live-monitoring', icon: Radio, label: 'Live Monitoring' },
      { path: '/sensor-details', icon: Gauge, label: 'Sensor Details' },
    ],
  },
  {
    label: 'Farm Management',
    items: [
      { path: '/crop-guide', icon: Sprout, label: 'Crop Guide' },
      { path: '/weather', icon: CloudRain, label: 'Live Weather' },
    ],
  },
  {
    label: 'Marketplace',
    items: [
      { path: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { path: '/chatbot', icon: MessageCircle, label: 'AI Chatbot' },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/profile', icon: UserCircle, label: 'Profile' },
      { path: '/settings', icon: SettingsIcon, label: 'Settings' },
      { path: '/admin', icon: ShieldCheck, label: 'Admin Panel', adminOnly: true },
    ],
  },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, mobileSidebarOpen, closeMobileSidebar } = useStore()
  const { isAdmin } = useAuthContext()

  const collapsed = !sidebarOpen

  const content = (
    <>
      {/* Logo / Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div
          className={`flex items-center gap-2.5 overflow-hidden ${
            collapsed ? 'lg:w-full lg:justify-center' : ''
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
            <Leaf size={20} />
          </div>
          <div className={`whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}>
            <h1 className="text-base font-bold leading-tight tracking-tight">
              AgroBazaar
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              IoT Smart Farming
            </p>
          </div>
        </div>

        <button
          onClick={toggleSidebar}
          className="hidden rounded-lg p-1.5 transition-colors hover:bg-white/10 lg:flex"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        <button
          onClick={closeMobileSidebar}
          className="rounded-lg p-1.5 transition-colors hover:bg-white/10 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4 pt-3">
        {menuGroups.map((group) => {
          const items = group.items.filter((item) => !(item.adminOnly && !isAdmin))
          if (items.length === 0) return null

          return (
            <div key={group.label} className="mb-3">
              <p
                className={`px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-wider text-white/40 ${
                  collapsed ? 'lg:hidden' : ''
                }`}
              >
                {group.label}
              </p>

              {items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) => `
                    group relative mx-1 my-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }
                    ${collapsed ? 'lg:justify-center' : ''}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-lime-300" />
                      )}
                      <item.icon size={19} className="shrink-0" />
                      <span
                        className={`whitespace-nowrap ${
                          collapsed ? 'lg:hidden' : ''
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className={`text-center ${collapsed ? 'lg:hidden' : ''}`}>
          <p className="text-[11px] font-medium text-white/50">
            IoT Smart Agriculture & Marketplace
          </p>
          <p className="mt-0.5 text-[10px] text-white/30">
            v2.0.0 · Powered by AgroBazaar
          </p>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-gradient-to-b from-emerald-700 via-green-700 to-teal-800 text-white shadow-2xl
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:w-64' : 'lg:w-[76px]'}
          w-72 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {content}
      </aside>
    </>
  )
}