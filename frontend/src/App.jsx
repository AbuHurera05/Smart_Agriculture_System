import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import IoTDashboard from './pages/IoTDashboard'
import AdminPanel from './pages/AdminPanel'
import CropGuide from './pages/CropGuide'
import LiveWeather from './pages/LiveWeather'
import AgriNews from './pages/AgriNews'
import MobileAppView from './pages/MobileAppView'
import FarmerNetwork from './pages/FarmerNetwork'
import LandManagement from './pages/LandManagement'
import SmartAnalytics from './pages/SmartAnalytics'
import IrrigationAdvice from './pages/IrrigationAdvice'
import SoilTesting from './pages/SoilTesting'
import TrainingWorkshops from './pages/TrainingWorkshops'
import Loader from './components/common/Loader'

function App() {
  const { isAuthenticated, loading } = useAuthContext()

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes - Only accessible when authenticated */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<IoTDashboard />} />
                <Route path="/crop-guide" element={<CropGuide />} />
                <Route path="/weather" element={<LiveWeather />} />
                <Route path="/news" element={<AgriNews />} />
                <Route path="/mobile-view" element={<MobileAppView />} />
                <Route path="/farmer-network" element={<FarmerNetwork />} />
                <Route path="/land-management" element={<LandManagement />} />
                <Route path="/analytics" element={<SmartAnalytics />} />
                <Route path="/irrigation" element={<IrrigationAdvice />} />
                <Route path="/soil-testing" element={<SoilTesting />} />
                <Route path="/training" element={<TrainingWorkshops />} />
                
                {/* Admin Only Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default App