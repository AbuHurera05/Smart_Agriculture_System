// import { Navigate } from 'react-router-dom'
// import { useAuthContext } from '../context/AuthContext'
// import Loader from './common/Loader'

// export default function ProtectedRoute({ children, requiredRole }) {
//   const { isAuthenticated, loading, user } = useAuthContext()

//   if (loading) {
//     return <Loader fullScreen />
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />
//   }

//   if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
//     return <Navigate to="/dashboard" replace />
//   }

//   return children
// }

import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import Loader from './common/Loader'

export default function ProtectedRoute({ children, requiredRole }) {
  const {
    isAuthenticated,
    loading,
    user,
  } = useAuthContext()

  // Wait until authentication state is loaded
  if (loading) {
    return <Loader fullScreen />
  }

  // User is not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  /*
   * Backend role structure:
   *
   * role:
   *   ADMIN
   *   USER
   *
   * userType:
   *   ADMIN
   *   FARMER
   *   EXPERT
   *
   * Frontend routes use:
   *   admin
   *   expert
   */

  if (requiredRole) {
    const required = requiredRole.toUpperCase()

    const securityRole = user?.role?.toUpperCase()
    const userType = user?.userType?.toUpperCase()

    // ADMIN can access everything that requires ADMIN
    if (required === 'ADMIN') {
      const isAdmin =
        securityRole === 'ADMIN' ||
        userType === 'ADMIN'

      if (!isAdmin) {
        return <Navigate to="/dashboard" replace />
      }
    }

    // EXPERT can access Expert Dashboard
    if (required === 'EXPERT') {
      const isExpert =
        userType === 'EXPERT' ||
        securityRole === 'ADMIN' ||
        userType === 'ADMIN'

      if (!isExpert) {
        return <Navigate to="/dashboard" replace />
      }
    }
  }

  return children
}
