// import React, { createContext, useState, useContext, useEffect } from 'react'
// import toast from 'react-hot-toast'
// import { authAPI, userAPI, adminAPI } from '../services/api'

// const AuthContext = createContext()

// export const useAuthContext = () => {
//   const context = useContext(AuthContext)

//   if (!context) {
//     throw new Error('useAuthContext must be used within AuthProvider')
//   }

//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [loading, setLoading] = useState(true)

//   /*
//    * These users are kept only for frontend/admin UI compatibility.
//    * Authentication itself is now handled by the Spring Boot backend.
//    */
//   const [users, setUsers] = useState([])

//   /*
//    * Expert applications are currently kept in frontend state.
//    * These can later be connected to the backend expert APIs.
//    */
//   const [expertRequests, setExpertRequests] = useState([])

//   // =========================================================
//   // INITIAL SESSION CHECK
//   // =========================================================

//   useEffect(() => {
//     const restoreSession = async () => {
//       const token = localStorage.getItem('token')
//       const savedUser = localStorage.getItem('user')

//       if (!token) {
//         setLoading(false)
//         return
//       }

//       try {
//         /*
//          * Verify the token with the backend instead of trusting
//          * only the localStorage user object.
//          */
//         const response = await authAPI.getProfile()

//         const userData = response.data?.data

//         if (userData) {
//           setUser(userData)
//           setIsAuthenticated(true)

//           localStorage.setItem('user', JSON.stringify(userData))
//         } else if (savedUser) {
//           /*
//            * Fallback in case the backend response does not contain
//            * the expected user data.
//            */
//           const userData = JSON.parse(savedUser)

//           setUser(userData)
//           setIsAuthenticated(true)
//         }
//       } catch (error) {
//         console.error('Session restore failed:', error)

//         localStorage.removeItem('token')
//         localStorage.removeItem('user')

//         setUser(null)
//         setIsAuthenticated(false)
//       } finally {
//         setLoading(false)
//       }
//     }

//     restoreSession()
//   }, [])

//   // =========================================================
//   // LOGIN
//   // =========================================================

//   const login = async (email, password) => {
//     setLoading(true)

//     try {
//       const response = await authAPI.login({
//         email,
//         password,
//       })

//       const authData = response.data?.data

//       if (!authData) {
//         throw new Error('Invalid login response from server')
//       }

//       const token = authData.token
//       const refreshToken = authData.refreshToken
//       const userData = authData.user

//       if (!token) {
//         throw new Error('Token was not returned by server')
//       }

//       // Axios interceptor isi key ko read karta hai
//       localStorage.setItem('token', token)

//       if (refreshToken) {
//         localStorage.setItem('refreshToken', refreshToken)
//       }

//       if (userData) {
//         localStorage.setItem('user', JSON.stringify(userData))
//         setUser(userData)
//       }

//       setIsAuthenticated(true)

//       toast.success(
//         `Welcome back${userData?.name ? `, ${userData.name}` : ''}!`
//       )

//       return {
//         success: true,
//         user: userData,
//         token,
//         refreshToken,
//       }
//     } catch (error) {
//       console.error('Login error:', error)

//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         'Invalid email or password'

//       toast.error(message)

//       return {
//         success: false,
//         error: message,
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================================================
//   // REGISTER
//   // =========================================================

//   const register = async (userData) => {
//     setLoading(true)

//     try {
//       /*
//        * Send registration data to Spring Boot.
//        */
//       const response = await authAPI.register(userData)

//       const authData = response.data?.data

//       if (authData?.token) {
//         localStorage.setItem('token', authData.token)
//       }

//       if (authData?.refreshToken) {
//         localStorage.setItem('refreshToken', authData.refreshToken)
//       }

//       if (authData?.user) {
//         localStorage.setItem(
//           'user',
//           JSON.stringify(authData.user)
//         )

//         setUser(authData.user)
//         setIsAuthenticated(true)
//       }

//       toast.success(
//         response.data?.message || 'Registration successful!'
//       )

//       return {
//         success: true,
//         user: authData?.user || null,
//       }
//     } catch (error) {
//       console.error('Registration error:', error)

//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         'Registration failed'

//       toast.error(message)

//       return {
//         success: false,
//         error: message,
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================================================
//   // LOGOUT
//   // =========================================================

//   const logout = async () => {
//     try {
//       /*
//        * Call backend logout endpoint.
//        *
//        * Even though JWT is stateless, this keeps frontend and
//        * backend behaviour consistent.
//        */
//       await authAPI.logout()
//     } catch (error) {
//       /*
//        * Logout should still happen locally even if the backend
//        * request fails.
//        */
//       console.warn('Backend logout failed:', error)
//     } finally {
//       localStorage.removeItem('token')
//       localStorage.removeItem('refreshToken')
//       localStorage.removeItem('user')

//       setUser(null)
//       setIsAuthenticated(false)

//       toast.success('Logged out successfully')
//     }
//   }

//   // =========================================================
//   // BECOME SELLER
//   // =========================================================

//   const becomeSeller = async (sellerData) => {
//     setLoading(true)

//     try {
//       /*
//        * Seller API will be connected here once marketplaceAPI
//        * is imported.
//        *
//        * For now this preserves your existing frontend behaviour.
//        */
//       const updatedUser = {
//         ...user,
//         isSeller: true,
//         sellerProfile: {
//           shopName: sellerData.shopName,
//           description: sellerData.description,
//           location: sellerData.location || user?.location,
//           rating: 0,
//           totalSales: 0,
//           verified: false,
//           joinedAsSellerOn: new Date().toISOString().split('T')[0],
//         },
//       }

//       setUser(updatedUser)

//       localStorage.setItem(
//         'user',
//         JSON.stringify(updatedUser)
//       )

//       toast.success(
//         'You are now a registered seller! Start listing your products.'
//       )

//       return {
//         success: true,
//         user: updatedUser,
//       }
//     } catch (error) {
//       console.error('Seller registration error:', error)

//       toast.error('Could not complete seller registration')

//       return {
//         success: false,
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================================================
//   // APPLY FOR EXPERT
//   // =========================================================

//   const applyForExpert = async (applicationData) => {
//     setLoading(true)

//     try {
//       if (!user) {
//         toast.error('You must be logged in to apply')
//         return { success: false }
//       }

//       const alreadyPending = expertRequests.some(
//         (request) =>
//           request.userId === user.id &&
//           request.status === 'pending'
//       )

//       if (alreadyPending) {
//         toast.error(
//           'You already have a pending expert application'
//         )

//         return {
//           success: false,
//         }
//       }

//       /*
//        * This currently keeps the expert application in frontend
//        * state. It can be connected to /experts/apply later.
//        */
//       const newRequest = {
//         id: expertRequests.length
//           ? Math.max(...expertRequests.map((r) => r.id)) + 1
//           : 1,

//         userId: user.id,
//         name: user.name,
//         email: user.email,

//         specialization: applicationData.specialization,
//         experience: applicationData.experience,
//         motivation: applicationData.motivation,

//         status: 'pending',

//         requestDate: new Date()
//           .toISOString()
//           .split('T')[0],
//       }

//       setExpertRequests((prev) => [
//         ...prev,
//         newRequest,
//       ])

//       const updatedUser = {
//         ...user,
//         expertRequestStatus: 'pending',
//       }

//       setUser(updatedUser)

//       localStorage.setItem(
//         'user',
//         JSON.stringify(updatedUser)
//       )

//       setUsers((prev) =>
//         prev.map((existingUser) =>
//           existingUser.id === user.id
//             ? {
//               ...existingUser,
//               expertRequestStatus: 'pending',
//             }
//             : existingUser
//         )
//       )

//       toast.success(
//         'Application submitted! An admin will review your request.'
//       )

//       return {
//         success: true,
//       }
//     } catch (error) {
//       console.error('Expert application error:', error)

//       toast.error('Could not submit application')

//       return {
//         success: false,
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================================================
//   // APPROVE EXPERT REQUEST
//   // =========================================================

//   const approveExpertRequest = (requestId) => {
//     const request = expertRequests.find(
//       (r) => r.id === requestId
//     )

//     if (!request) {
//       return
//     }

//     setExpertRequests((prev) =>
//       prev.map((r) =>
//         r.id === requestId
//           ? {
//             ...r,
//             status: 'approved',
//           }
//           : r
//       )
//     )

//     setUsers((prev) =>
//       prev.map((existingUser) =>
//         existingUser.id === request.userId
//           ? {
//             ...existingUser,
//             role: 'expert',
//             expertRequestStatus: 'approved',
//           }
//           : existingUser
//       )
//     )

//     if (user?.id === request.userId) {
//       const updatedUser = {
//         ...user,
//         role: 'expert',
//         expertRequestStatus: 'approved',
//       }

//       setUser(updatedUser)

//       localStorage.setItem(
//         'user',
//         JSON.stringify(updatedUser)
//       )
//     }

//     toast.success(
//       `${request.name} has been approved as an Expert`
//     )
//   }

//   // =========================================================
//   // REJECT EXPERT REQUEST
//   // =========================================================

//   const rejectExpertRequest = (requestId) => {
//     const request = expertRequests.find(
//       (r) => r.id === requestId
//     )

//     if (!request) {
//       return
//     }

//     setExpertRequests((prev) =>
//       prev.map((r) =>
//         r.id === requestId
//           ? {
//             ...r,
//             status: 'rejected',
//           }
//           : r
//       )
//     )

//     setUsers((prev) =>
//       prev.map((existingUser) =>
//         existingUser.id === request.userId
//           ? {
//             ...existingUser,
//             expertRequestStatus: 'rejected',
//           }
//           : existingUser
//       )
//     )

//     if (user?.id === request.userId) {
//       const updatedUser = {
//         ...user,
//         expertRequestStatus: 'rejected',
//       }

//       setUser(updatedUser)

//       localStorage.setItem(
//         'user',
//         JSON.stringify(updatedUser)
//       )
//     }

//     toast.success(
//       `${request.name}'s expert application was rejected`
//     )
//   }

//   // =========================================================
//   // ADMIN ADD USER
//   // =========================================================

// const adminAddUser = async (data) => {
//   setLoading(true)

//   try {
//     const response = await adminAPI.createUser(data)

//     const newUser = response.data?.data

//     if (!newUser) {
//       throw new Error('Invalid response from server')
//     }

//     setUsers((prev) => [...prev, newUser])

//     toast.success(
//       response.data?.message || 'User created successfully'
//     )

//     return {
//       success: true,
//       user: newUser,
//     }
//   } catch (error) {
//     console.error('Admin create user error:', error)

//     const message =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       error.message ||
//       'Could not create user'

//     toast.error(message)

//     return {
//       success: false,
//       error: message,
//     }
//   } finally {
//     setLoading(false)
//   }
// }

//   // =========================================================
//   // ADMIN UPDATE USER
//   // =========================================================

// const adminUpdateUser = async (id, updates) => {
//   setLoading(true)

//   try {
//     const response = await adminAPI.updateUser(id, updates)

//     const updatedUser = response.data?.data

//     if (!updatedUser) {
//       throw new Error('Invalid response from server')
//     }

//     setUsers((prev) =>
//       prev.map((existingUser) =>
//         existingUser.id === id
//           ? updatedUser
//           : existingUser
//       )
//     )

//     // Agar admin apna hi account update kar raha hai
//     if (user?.id === id) {
//       setUser(updatedUser)

//       localStorage.setItem(
//         'user',
//         JSON.stringify(updatedUser)
//       )
//     }

//     toast.success(
//       response.data?.message || 'User updated successfully'
//     )

//     return {
//       success: true,
//       user: updatedUser,
//     }
//   } catch (error) {
//     console.error('Admin update user error:', error)

//     const message =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       error.message ||
//       'Could not update user'

//     toast.error(message)

//     return {
//       success: false,
//       error: message,
//     }
//   } finally {
//     setLoading(false)
//   }
// }

//   // =========================================================
//   // ADMIN DELETE USER
//   // =========================================================

// const adminDeleteUser = async (id) => {
//   setLoading(true)

//   try {
//     const response = await adminAPI.deleteUser(id)

//     setUsers((prev) =>
//       prev.filter((existingUser) => existingUser.id !== id)
//     )

//     toast.success(
//       response.data?.message || 'User deleted successfully'
//     )

//     return {
//       success: true,
//     }
//   } catch (error) {
//     console.error('Admin delete user error:', error)

//     const message =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       error.message ||
//       'Could not delete user'

//     toast.error(message)

//     return {
//       success: false,
//       error: message,
//     }
//   } finally {
//     setLoading(false)
//   }
// }

//   // =========================================================
//   // UPDATE CURRENT USER
//   // =========================================================

//   const updateUser = async (updatedData) => {
//     setLoading(true)

//     try {
//       const response = await userAPI.updateProfile(updatedData)

//       const updatedUser = response.data?.data

//       if (!updatedUser) {
//         throw new Error('Invalid profile response from server')
//       }

//       setUser(updatedUser)

//       localStorage.setItem(
//         'user',
//         JSON.stringify(updatedUser)
//       )

//       toast.success(
//         response.data?.message || 'Profile updated successfully'
//       )

//       return {
//         success: true,
//         user: updatedUser,
//       }
//     } catch (error) {
//       console.error('Profile update error:', error)

//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         'Profile update failed'

//       toast.error(message)

//       return {
//         success: false,
//         error: message,
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================================================
//   // UPDATE CURRENT USER PASSWORD
//   // =========================================================

//   const changePassword = async (passwordData) => {
//     setLoading(true)

//     try {
//       const response = await userAPI.changePassword(passwordData)

//       toast.success(
//         response.data?.message || 'Password changed successfully'
//       )

//       return {
//         success: true,
//       }
//     } catch (error) {
//       console.error('Change password error:', error)

//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         'Password change failed'

//       toast.error(message)

//       return {
//         success: false,
//         error: message,
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================================================
//   // UPDATE CURRENT USER AVATAR
//   // =========================================================
//   const uploadAvatar = async (file) => {
//     setLoading(true)

//     try {
//       const formData = new FormData()

//       formData.append('avatar', file)

//       const response = await userAPI.uploadAvatar(formData)

//       const updatedUser = response.data?.data

//       if (updatedUser) {
//         setUser(updatedUser)

//         localStorage.setItem(
//           'user',
//           JSON.stringify(updatedUser)
//         )
//       }

//       toast.success(
//         response.data?.message || 'Avatar updated successfully'
//       )

//       return {
//         success: true,
//         user: updatedUser,
//       }
//     } catch (error) {
//       console.error('Avatar upload error:', error)

//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         'Avatar upload failed'

//       toast.error(message)

//       return {
//         success: false,
//         error: message,
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================================================
//   // UPDATE CURRENT USER SETTING
//   // =========================================================

//   const updateSettings = async (settingsData) => {
//     setLoading(true)

//     try {
//       const response = await userAPI.updateSettings(settingsData)

//       toast.success(
//         response.data?.message || 'Settings updated successfully'
//       )

//       return {
//         success: true,
//         settings: response.data?.data,
//       }
//     } catch (error) {
//       console.error('Settings update error:', error)

//       const message =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         'Settings update failed'

//       toast.error(message)

//       return {
//         success: false,
//         error: message,
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================================================
//   // CONTEXT VALUE
//   // =========================================================

//   const value = {
//     user,
//     users,

//     isAuthenticated,
//     loading,

//     login,
//     register,
//     logout,

//     updateUser,
//     changePassword,
//     uploadAvatar,
//     updateSettings,
//     becomeSeller,

//     applyForExpert,
//     approveExpertRequest,
//     rejectExpertRequest,

//     expertRequests,

//     adminAddUser,
//     adminUpdateUser,
//     adminDeleteUser,

//     isSeller: !!user?.isSeller,

//     isAdmin:
//       user?.role === 'admin' ||
//       user?.role === 'ADMIN',

//     isFarmer:
//       user?.role === 'farmer' ||
//       user?.role === 'FARMER',

//     isExpert:
//       user?.role === 'expert' ||
//       user?.role === 'EXPERT',

//     expertRequestStatus:
//       user?.expertRequestStatus || null,
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }


import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { authAPI, userAPI, adminAPI, expertAPI, marketplaceAPI } from '../services/api'

const AuthContext = createContext()

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}

// Pulls the readable error message out of an axios error, with fallbacks.
const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Admin-only caches, populated on demand via fetchUsers() / fetchExpertRequests()
  const [users, setUsers] = useState([])
  const [expertRequests, setExpertRequests] = useState([])

  // Keeps localStorage + user state in sync in one place.
  const persistUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  // =========================================================
  // INITIAL SESSION CHECK
  // =========================================================

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Always trust the backend's copy of the user, not localStorage.
        const response = await authAPI.getProfile()
        const userData = response.data?.data

        if (!userData) {
          throw new Error('Empty profile response')
        }

        persistUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Session restore failed:', error)
        clearSession()
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (email, password) => {
    setLoading(true)

    try {
      const response = await authAPI.login({ email, password })
      const authData = response.data?.data

      if (!authData?.token) {
        throw new Error('Invalid login response from server')
      }

      const { token, refreshToken, user: userData } = authData

      // The axios request interceptor reads this key to attach the
      // Authorization header on future requests.
      localStorage.setItem('token', token)

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }

      if (userData) {
        persistUser(userData)
      }

      setIsAuthenticated(true)
      toast.success(`Welcome back${userData?.name ? `, ${userData.name}` : ''}!`)

      return { success: true, user: userData, token, refreshToken }
    } catch (error) {
      console.error('Login error:', error)
      const message = getErrorMessage(error, 'Invalid email or password')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // REGISTER
  // =========================================================

  const register = async (userData) => {
    setLoading(true)

    try {
      const response = await authAPI.register(userData)
      const authData = response.data?.data

      if (authData?.token) {
        localStorage.setItem('token', authData.token)
      }

      if (authData?.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken)
      }

      if (authData?.user) {
        persistUser(authData.user)
        setIsAuthenticated(true)
      }

      toast.success(response.data?.message || 'Registration successful!')

      return { success: true, user: authData?.user || null }
    } catch (error) {
      console.error('Registration error:', error)
      const message = getErrorMessage(error, 'Registration failed')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {
    try {
      // JWT is stateless, but we still call the backend so behaviour
      // stays consistent (and to support future token blacklisting).
      await authAPI.logout()
    } catch (error) {
      // Logout should still happen locally even if the request fails.
      console.warn('Backend logout failed:', error)
    } finally {
      clearSession()
      setUsers([])
      setExpertRequests([])
      toast.success('Logged out successfully')
    }
  }

  // =========================================================
  // BECOME SELLER
  // =========================================================
  // POST /marketplace/sellers/register - returns a SellerProfileResponse,
  // not an updated user, so we flag isSeller locally after success.

  const becomeSeller = async (sellerData) => {
    setLoading(true)

    try {
      const response = await marketplaceAPI.becomeSeller({
        shopName: sellerData.shopName,
        description: sellerData.description,
        location: sellerData.location || user?.location,
      })

      const sellerProfile = response.data?.data

      const updatedUser = {
        ...user,
        isSeller: true,
        sellerProfile,
      }

      persistUser(updatedUser)
      toast.success(response.data?.message || 'You are now a registered seller!')

      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Seller registration error:', error)
      const message = getErrorMessage(error, 'Could not complete seller registration')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // EXPERT APPLICATIONS (farmer applies, admin approves/rejects)
  // =========================================================

  const applyForExpert = async (applicationData) => {
    if (!user) {
      toast.error('You must be logged in to apply')
      return { success: false }
    }

    if (user.expertRequestStatus === 'pending') {
      toast.error('You already have a pending expert application')
      return { success: false }
    }

    setLoading(true)

    try {
      const response = await expertAPI.apply(applicationData)
      const newRequest = response.data?.data

      if (newRequest) {
        setExpertRequests((prev) => [...prev, newRequest])
      }

      persistUser({ ...user, expertRequestStatus: 'pending' })
      toast.success(response.data?.message || 'Application submitted! An admin will review your request.')

      return { success: true }
    } catch (error) {
      console.error('Expert application error:', error)
      const message = getErrorMessage(error, 'Could not submit application')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const approveExpertRequest = async (requestId) => {
    try {
      const response = await expertAPI.approve(requestId)
      const updatedRequest = response.data?.data

      setExpertRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...updatedRequest, status: 'approved' } : r))
      )

      setUsers((prev) =>
        prev.map((u) =>
          u.id === updatedRequest?.userId
            ? { ...u, userType: 'EXPERT', expertRequestStatus: 'approved' }
            : u
        )
      )

      // If the admin is approving their own request (edge case), keep local state in sync.
      if (user?.id === updatedRequest?.userId) {
        persistUser({ ...user, userType: 'EXPERT', expertRequestStatus: 'approved' })
      }

      toast.success(response.data?.message || `${updatedRequest?.name || 'Request'} approved as Expert`)
      return { success: true }
    } catch (error) {
      console.error('Approve expert request error:', error)
      const message = getErrorMessage(error, 'Could not approve request')
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const rejectExpertRequest = async (requestId) => {
    try {
      const response = await expertAPI.reject(requestId)
      const updatedRequest = response.data?.data

      setExpertRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...updatedRequest, status: 'rejected' } : r))
      )

      setUsers((prev) =>
        prev.map((u) =>
          u.id === updatedRequest?.userId ? { ...u, expertRequestStatus: 'rejected' } : u
        )
      )

      if (user?.id === updatedRequest?.userId) {
        persistUser({ ...user, expertRequestStatus: 'rejected' })
      }

      toast.success(response.data?.message || `${updatedRequest?.name || 'Request'} rejected`)
      return { success: true }
    } catch (error) {
      console.error('Reject expert request error:', error)
      const message = getErrorMessage(error, 'Could not reject request')
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Admins load this on demand (e.g. when opening the Expert Requests tab).
  const fetchExpertRequests = useCallback(async () => {
    try {
      const response = await expertAPI.getAllRequests()
      setExpertRequests(response.data?.data || [])
      return { success: true }
    } catch (error) {
      console.error('Fetch expert requests error:', error)
      toast.error(getErrorMessage(error, 'Could not load expert requests'))
      return { success: false }
    }
  }, [])

  // =========================================================
  // ADMIN: USER MANAGEMENT
  // =========================================================

  // Admins load this on demand (e.g. when opening the User Management tab).
  const fetchUsers = useCallback(async () => {
    try {
      const response = await adminAPI.getAllUsers()
      setUsers(response.data?.data || [])
      return { success: true }
    } catch (error) {
      console.error('Fetch users error:', error)
      toast.error(getErrorMessage(error, 'Could not load users'))
      return { success: false }
    }
  }, [])

  const adminAddUser = async (data) => {
    setLoading(true)

    try {
      const response = await adminAPI.createUser(data)
      const newUser = response.data?.data

      if (!newUser) {
        throw new Error('Invalid response from server')
      }

      setUsers((prev) => [...prev, newUser])
      toast.success(response.data?.message || 'User created successfully')

      return { success: true, user: newUser }
    } catch (error) {
      console.error('Admin create user error:', error)
      const message = getErrorMessage(error, 'Could not create user')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const adminUpdateUser = async (id, updates) => {
    setLoading(true)

    try {
      const response = await adminAPI.updateUser(id, updates)
      const updatedUser = response.data?.data

      if (!updatedUser) {
        throw new Error('Invalid response from server')
      }

      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)))

      // Admin editing their own account
      if (user?.id === id) {
        persistUser(updatedUser)
      }

      toast.success(response.data?.message || 'User updated successfully')
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Admin update user error:', error)
      const message = getErrorMessage(error, 'Could not update user')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const adminDeleteUser = async (id) => {
    setLoading(true)

    try {
      const response = await adminAPI.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success(response.data?.message || 'User deleted successfully')
      return { success: true }
    } catch (error) {
      console.error('Admin delete user error:', error)
      const message = getErrorMessage(error, 'Could not delete user')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // CURRENT USER: PROFILE / PASSWORD / AVATAR / SETTINGS
  // =========================================================

  const updateUser = async (updatedData) => {
    setLoading(true)

    try {
      const response = await userAPI.updateProfile(updatedData)
      const updatedUser = response.data?.data

      if (!updatedUser) {
        throw new Error('Invalid profile response from server')
      }

      persistUser(updatedUser)
      toast.success(response.data?.message || 'Profile updated successfully')

      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Profile update error:', error)
      const message = getErrorMessage(error, 'Profile update failed')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (passwordData) => {
    setLoading(true)

    try {
      const response = await userAPI.changePassword(passwordData)
      toast.success(response.data?.message || 'Password changed successfully')
      return { success: true }
    } catch (error) {
      console.error('Change password error:', error)
      const message = getErrorMessage(error, 'Password change failed')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const uploadAvatar = async (file) => {
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await userAPI.uploadAvatar(formData)
      const updatedUser = response.data?.data

      if (updatedUser) {
        persistUser(updatedUser)
      }

      toast.success(response.data?.message || 'Avatar updated successfully')
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Avatar upload error:', error)
      const message = getErrorMessage(error, 'Avatar upload failed')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (settingsData) => {
    setLoading(true)

    try {
      const response = await userAPI.updateSettings(settingsData)
      toast.success(response.data?.message || 'Settings updated successfully')
      return { success: true, settings: response.data?.data }
    } catch (error) {
      console.error('Settings update error:', error)
      const message = getErrorMessage(error, 'Settings update failed')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  // Backend distinguishes two things on UserResponse:
  //   role     -> security role: ADMIN / USER
  //   userType -> business role: ADMIN / FARMER / EXPERT
  // Role checks below use userType, since that's what actually
  // distinguishes farmers/experts/admins in this app.
  const userType = user?.userType?.toUpperCase()

  const value = {
    user,
    users,
    expertRequests,

    isAuthenticated,
    loading,

    login,
    register,
    logout,

    updateUser,
    changePassword,
    uploadAvatar,
    updateSettings,
    becomeSeller,

    applyForExpert,
    approveExpertRequest,
    rejectExpertRequest,
    fetchExpertRequests,

    fetchUsers,
    adminAddUser,
    adminUpdateUser,
    adminDeleteUser,

    isSeller: !!user?.isSeller,
    isAdmin: userType === 'ADMIN',
    isFarmer: userType === 'FARMER',
    isExpert: userType === 'EXPERT',

    expertRequestStatus: user?.expertRequestStatus || null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}