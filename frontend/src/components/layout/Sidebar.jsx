import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Sprout, 
  CloudRain, 
  Newspaper,
  Smartphone,
  Users,
  Map,
  TrendingUp,
  Droplet,
  FlaskConical,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import useStore from '../../store/useStore'
import { useAuthContext } from '../../context/AuthContext'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'IoT Dashboard' },
  { path: '/crop-guide', icon: Sprout, label: 'Crop Guide' },
  { path: '/weather', icon: CloudRain, label: 'Live Weather' },
  { path: '/news', icon: Newspaper, label: 'Agri News' },
  { path: '/farmer-network', icon: Users, label: 'Farmer Network' },
  { path: '/land-management', icon: Map, label: 'Land Management' },
  { path: '/analytics', icon: TrendingUp, label: 'Smart Analytics' },
  { path: '/irrigation', icon: Droplet, label: 'Irrigation Advice' },
  { path: '/soil-testing', icon: FlaskConical, label: 'Soil Testing' },
  { path: '/training', icon: GraduationCap, label: 'Training Workshops' },
  { path: '/mobile-view', icon: Smartphone, label: 'Mobile View' },
  { path: '/admin', icon: Settings, label: 'Admin Panel' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useStore()
  const { isAdmin } = useAuthContext() // Called at top level - CORRECT
  
  // Filter menu items based on admin access
  const filteredMenuItems = menuItems.filter(item => 
    !(item.path === '/admin' && !isAdmin)
  )

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white transition-all duration-300 flex flex-col shadow-lg`}>
      <div className="p-4 flex items-center justify-between border-b border-primary-light">
        <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>
          Smart Agri
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="p-2 hover:bg-primary-dark rounded-lg transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 mt-6">
        {filteredMenuItems.map((item) => (  // Using filteredMenuItems - CORRECT
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 transition-all duration-200
              ${isActive 
                ? 'bg-primary-dark border-l-4 border-secondary' 
                : 'hover:bg-primary-dark hover:border-l-4 hover:border-secondary-light'
              }
              ${!sidebarOpen && 'justify-center'}
            `}
          >
            <item.icon size={20} />
            <span className={`${!sidebarOpen && 'hidden'} text-sm`}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-primary-light">
        <div className={`text-center ${!sidebarOpen && 'hidden'}`}>
          <p className="text-xs opacity-75">Smart Agriculture System</p>
          <p className="text-xs opacity-50 mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  )
}