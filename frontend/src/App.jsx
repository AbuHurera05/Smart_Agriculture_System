import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './context/AuthContext'
import Layout from './components/layout/Layout'
import PublicLayout from './components/layout/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import StartupHome from './pages/StartupHome'
import Login from './pages/Login'
import OAuthCallback from './pages/OAuthCallback'
import IoTDashboard from './pages/IoTDashboard'
import AdminPanel from './pages/AdminPanel'
import AdminUserDetail from './pages/AdminUserDetail'
import CropGuide from './pages/CropGuide'
import LiveWeather from './pages/LiveWeather'
import Marketplace from './pages/Marketplace'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import OrderDetails from './pages/OrderDetails'
import Wishlist from './pages/Wishlist'
import SellerDashboard from './pages/SellerDashboard'
import SellerStore from './pages/SellerStore'
import LiveMonitoring from './pages/LiveMonitoring'
import SensorDetails from './pages/SensorDetails'
import AIChatbot from './pages/AIChatbot'
import UserProfile from './pages/UserProfile'
import Settings from './pages/Settings'
import About from './pages/About'
import Contact from './pages/Contact'
import Loader from './components/common/Loader'

// Smart layout selector:
// If the user is logged in, use Layout (with dashboard sidebar and farm controls).
// If unauthenticated / guest, use PublicLayout (clean public header & footer, NO sidebar).
function AppLayout({ children }) {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated ? <Layout>{children}</Layout> : <PublicLayout>{children}</PublicLayout>
}

function App() {
  const { loading } = useAuthContext()

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <Routes>
      {/* Startup / Landing Page - Direct Entry without Login */}
      <Route path="/" element={<StartupHome />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/oauth2/redirect" element={<OAuthCallback />} />

      {/* Public Pages:
          - If not logged in -> PublicLayout (Clean public navbar + footer, NO sidebar)
          - If logged in -> Layout (With dashboard sidebar)
      */}
      <Route path="/marketplace" element={<AppLayout><Marketplace /></AppLayout>} />
      <Route path="/marketplace/product/:id" element={<AppLayout><ProductDetail /></AppLayout>} />
      <Route path="/marketplace/cart" element={<AppLayout><Cart /></AppLayout>} />
      <Route path="/marketplace/checkout" element={<AppLayout><Checkout /></AppLayout>} />
      <Route path="/marketplace/seller/:id" element={<AppLayout><SellerStore /></AppLayout>} />
      <Route path="/crop-guide" element={<AppLayout><CropGuide /></AppLayout>} />
      <Route path="/weather" element={<AppLayout><LiveWeather /></AppLayout>} />
      <Route path="/about" element={<AppLayout><About /></AppLayout>} />
      <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />

      {/* Protected Farmer & Admin Pages:
          Guarded behind ProtectedRoute. Unauthenticated users are redirected to /login.
          Always rendered inside the internal Layout (with full sidebar).
      */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <IoTDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/live-monitoring"
        element={
          <ProtectedRoute>
            <Layout>
              <LiveMonitoring />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sensor-details"
        element={
          <ProtectedRoute>
            <Layout>
              <SensorDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Layout>
              <AIChatbot />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <UserProfile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace/orders"
        element={
          <ProtectedRoute>
            <Layout>
              <MyOrders />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace/orders/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <OrderDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace/wishlist"
        element={
          <ProtectedRoute>
            <Layout>
              <Wishlist />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace/seller"
        element={
          <ProtectedRoute>
            <Layout>
              <SellerDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Only Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout>
              <AdminPanel />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:userId"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout>
              <AdminUserDetail />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
