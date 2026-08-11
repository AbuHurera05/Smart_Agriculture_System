import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Radio,
  TrendingUp,
  Gauge,
  Sprout,
  CloudRain,
  Newspaper,
  Smartphone,
  Users,
  Map,
  Droplet,
  FlaskConical,
  GraduationCap,

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
      { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
      { path: '/sensor-details', icon: Gauge, label: 'Sensor Details' },
    ],
  },
  {
    label: 'Farm Management',
    items: [
      { path: '/crop-guide', icon: Sprout, label: 'Crop Guide' },
      { path: '/irrigation', icon: Droplet, label: 'Irrigation Advice' },
      { path: '/soil-testing', icon: FlaskConical, label: 'Soil Testing' },
      { path: '/land-management', icon: Map, label: 'Land Management' },
      { path: '/weather', icon: CloudRain, label: 'Live Weather' },
    ],
  },
  {
    label: 'Community',
    items: [
      { path: '/farmer-network', icon: Users, label: 'Farmer Network' },
      { path: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
      { path: '/training', icon: GraduationCap, label: 'Training Workshops' },
      { path: '/news', icon: Newspaper, label: 'Agri News' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { path: '/chatbot', icon: MessageCircle, label: 'AI Chatbot' },
      { path: '/mobile-view', icon: Smartphone, label: 'Mobile View' },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/expert', icon: GraduationCap, label: 'Expert Dashboard', expertOnly: true },
      { path: '/profile', icon: UserCircle, label: 'Profile' },
      { path: '/settings', icon: SettingsIcon, label: 'Settings' },
      { path: '/admin', icon: ShieldCheck, label: 'Admin Panel', adminOnly: true },
    ],
  },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, mobileSidebarOpen, closeMobileSidebar } = useStore()
  const { isAdmin, isExpert } = useAuthContext()

  const collapsed = !sidebarOpen

  const content = (
    <>
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className={`flex items-center gap-2 overflow-hidden ${collapsed ? 'lg:justify-center lg:w-full' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Leaf size={20} />
          </div>
          <h1 className={`font-bold text-lg tracking-tight whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}>
            Smart Agri
          </h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
        <button
          onClick={closeMobileSidebar}
          className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 mt-3 overflow-y-auto pb-4">
        {menuGroups.map((group) => {
          const items = group.items.filter((item) =>
            !(item.adminOnly && !isAdmin) && !(item.expertOnly && !isExpert && !isAdmin)
          )
          if (items.length === 0) return null
          return (
            <div key={group.label} className="mb-2">
              <p className={`px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/45 ${collapsed ? 'lg:hidden' : ''}`}>
                {group.label}
              </p>
              {items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) => `
                    group relative mx-2 my-0.5 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-white/15 text-white shadow-inner'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }
                    ${collapsed ? 'lg:justify-center' : ''}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-secondary" />
                      )}
                      <item.icon size={19} className="shrink-0" />
                      <span className={`text-sm font-medium whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className={`text-center ${collapsed ? 'lg:hidden' : ''}`}>
          <p className="text-xs text-white/60">Smart Agriculture System</p>
          <p className="text-[11px] text-white/40 mt-0.5">v2.0.0 &middot; IoT Platform</p>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 flex flex-col
          bg-gradient-to-b from-primary to-primary-dark text-white shadow-xl
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
