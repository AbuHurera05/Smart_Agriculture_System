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