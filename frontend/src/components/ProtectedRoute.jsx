import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import Loader from './common/Loader'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, user } = useAuthContext()

  if (loading) {
    return <Loader fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}