import React, { createContext, useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast'
import { authAPI, userAPI, adminAPI } from '../services/api'

const AuthContext = createContext()

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  /*
   * These users are kept only for frontend/admin UI compatibility.
   * Authentication itself is now handled by the Spring Boot backend.
   */
  const [users, setUsers] = useState([])

  /*
   * Expert applications are currently kept in frontend state.
   * These can later be connected to the backend expert APIs.
   */
  const [expertRequests, setExpertRequests] = useState([])

  // =========================================================
  // INITIAL SESSION CHECK
  // =========================================================

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        /*
         * Verify the token with the backend instead of trusting
         * only the localStorage user object.
         */
        const response = await authAPI.getProfile()

        const userData = response.data?.data

        if (userData) {
          setUser(userData)
          setIsAuthenticated(true)

          localStorage.setItem('user', JSON.stringify(userData))
        } else if (savedUser) {
          /*
           * Fallback in case the backend response does not contain
           * the expected user data.
           */
          const userData = JSON.parse(savedUser)

          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Session restore failed:', error)

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setUser(null)
        setIsAuthenticated(false)
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
      const response = await authAPI.login({
        email,
        password,
      })

      const authData = response.data?.data

      if (!authData) {
        throw new Error('Invalid login response from server')
      }

      const token = authData.token
      const refreshToken = authData.refreshToken
      const userData = authData.user

      if (!token) {
        throw new Error('Token was not returned by server')
      }

      // Axios interceptor isi key ko read karta hai
      localStorage.setItem('token', token)

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
      }

      setIsAuthenticated(true)

      toast.success(
        `Welcome back${userData?.name ? `, ${userData.name}` : ''}!`
      )

      return {
        success: true,
        user: userData,
        token,
        refreshToken,
      }
    } catch (error) {
      console.error('Login error:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Invalid email or password'

      toast.error(message)

      return {
        success: false,
        error: message,
      }
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
      /*
       * Send registration data to Spring Boot.
       */
      const response = await authAPI.register(userData)

      const authData = response.data?.data

      if (authData?.token) {
        localStorage.setItem('token', authData.token)
      }

      if (authData?.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken)
      }

      if (authData?.user) {
        localStorage.setItem(
          'user',
          JSON.stringify(authData.user)
        )

        setUser(authData.user)
        setIsAuthenticated(true)
      }

      toast.success(
        response.data?.message || 'Registration successful!'
      )

      return {
        success: true,
        user: authData?.user || null,
      }
    } catch (error) {
      console.error('Registration error:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed'

      toast.error(message)

      return {
        success: false,
        error: message,
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {
    try {
      /*
       * Call backend logout endpoint.
       *
       * Even though JWT is stateless, this keeps frontend and
       * backend behaviour consistent.
       */
      await authAPI.logout()
    } catch (error) {
      /*
       * Logout should still happen locally even if the backend
       * request fails.
       */
      console.warn('Backend logout failed:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      setUser(null)
      setIsAuthenticated(false)

      toast.success('Logged out successfully')
    }
  }

  // =========================================================
  // BECOME SELLER
  // =========================================================

  const becomeSeller = async (sellerData) => {
    setLoading(true)

    try {
      /*
       * Seller API will be connected here once marketplaceAPI
       * is imported.
       *
       * For now this preserves your existing frontend behaviour.
       */
      const updatedUser = {
        ...user,
        isSeller: true,
        sellerProfile: {
          shopName: sellerData.shopName,
          description: sellerData.description,
          location: sellerData.location || user?.location,
          rating: 0,
          totalSales: 0,
          verified: false,
          joinedAsSellerOn: new Date().toISOString().split('T')[0],
        },
      }

      setUser(updatedUser)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      toast.success(
        'You are now a registered seller! Start listing your products.'
      )

      return {
        success: true,
        user: updatedUser,
      }
    } catch (error) {
      console.error('Seller registration error:', error)

      toast.error('Could not complete seller registration')

      return {
        success: false,
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // APPLY FOR EXPERT
  // =========================================================

  const applyForExpert = async (applicationData) => {
    setLoading(true)

    try {
      if (!user) {
        toast.error('You must be logged in to apply')
        return { success: false }
      }

      const alreadyPending = expertRequests.some(
        (request) =>
          request.userId === user.id &&
          request.status === 'pending'
      )

      if (alreadyPending) {
        toast.error(
          'You already have a pending expert application'
        )

        return {
          success: false,
        }
      }

      /*
       * This currently keeps the expert application in frontend
       * state. It can be connected to /experts/apply later.
       */
      const newRequest = {
        id: expertRequests.length
          ? Math.max(...expertRequests.map((r) => r.id)) + 1
          : 1,

        userId: user.id,
        name: user.name,
        email: user.email,

        specialization: applicationData.specialization,
        experience: applicationData.experience,
        motivation: applicationData.motivation,

        status: 'pending',

        requestDate: new Date()
          .toISOString()
          .split('T')[0],
      }

      setExpertRequests((prev) => [
        ...prev,
        newRequest,
      ])

      const updatedUser = {
        ...user,
        expertRequestStatus: 'pending',
      }

      setUser(updatedUser)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      setUsers((prev) =>
        prev.map((existingUser) =>
          existingUser.id === user.id
            ? {
              ...existingUser,
              expertRequestStatus: 'pending',
            }
            : existingUser
        )
      )

      toast.success(
        'Application submitted! An admin will review your request.'
      )

      return {
        success: true,
      }
    } catch (error) {
      console.error('Expert application error:', error)

      toast.error('Could not submit application')

      return {
        success: false,
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // APPROVE EXPERT REQUEST
  // =========================================================

  const approveExpertRequest = (requestId) => {
    const request = expertRequests.find(
      (r) => r.id === requestId
    )

    if (!request) {
      return
    }

    setExpertRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
            ...r,
            status: 'approved',
          }
          : r
      )
    )

    setUsers((prev) =>
      prev.map((existingUser) =>
        existingUser.id === request.userId
          ? {
            ...existingUser,
            role: 'expert',
            expertRequestStatus: 'approved',
          }
          : existingUser
      )
    )

    if (user?.id === request.userId) {
      const updatedUser = {
        ...user,
        role: 'expert',
        expertRequestStatus: 'approved',
      }

      setUser(updatedUser)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )
    }

    toast.success(
      `${request.name} has been approved as an Expert`
    )
  }

  // =========================================================
  // REJECT EXPERT REQUEST
  // =========================================================

  const rejectExpertRequest = (requestId) => {
    const request = expertRequests.find(
      (r) => r.id === requestId
    )

    if (!request) {
      return
    }

    setExpertRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
            ...r,
            status: 'rejected',
          }
          : r
      )
    )

    setUsers((prev) =>
      prev.map((existingUser) =>
        existingUser.id === request.userId
          ? {
            ...existingUser,
            expertRequestStatus: 'rejected',
          }
          : existingUser
      )
    )

    if (user?.id === request.userId) {
      const updatedUser = {
        ...user,
        expertRequestStatus: 'rejected',
      }

      setUser(updatedUser)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )
    }

    toast.success(
      `${request.name}'s expert application was rejected`
    )
  }

  // =========================================================
  // ADMIN ADD USER
  // =========================================================

const adminAddUser = async (data) => {
  setLoading(true)

  try {
    const response = await adminAPI.createUser(data)

    const newUser = response.data?.data

    if (!newUser) {
      throw new Error('Invalid response from server')
    }

    setUsers((prev) => [...prev, newUser])

    toast.success(
      response.data?.message || 'User created successfully'
    )

    return {
      success: true,
      user: newUser,
    }
  } catch (error) {
    console.error('Admin create user error:', error)

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Could not create user'

    toast.error(message)

    return {
      success: false,
      error: message,
    }
  } finally {
    setLoading(false)
  }
}

  // =========================================================
  // ADMIN UPDATE USER
  // =========================================================

const adminUpdateUser = async (id, updates) => {
  setLoading(true)

  try {
    const response = await adminAPI.updateUser(id, updates)

    const updatedUser = response.data?.data

    if (!updatedUser) {
      throw new Error('Invalid response from server')
    }

    setUsers((prev) =>
      prev.map((existingUser) =>
        existingUser.id === id
          ? updatedUser
          : existingUser
      )
    )

    // Agar admin apna hi account update kar raha hai
    if (user?.id === id) {
      setUser(updatedUser)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )
    }

    toast.success(
      response.data?.message || 'User updated successfully'
    )

    return {
      success: true,
      user: updatedUser,
    }
  } catch (error) {
    console.error('Admin update user error:', error)

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Could not update user'

    toast.error(message)

    return {
      success: false,
      error: message,
    }
  } finally {
    setLoading(false)
  }
}

  // =========================================================
  // ADMIN DELETE USER
  // =========================================================

const adminDeleteUser = async (id) => {
  setLoading(true)

  try {
    const response = await adminAPI.deleteUser(id)

    setUsers((prev) =>
      prev.filter((existingUser) => existingUser.id !== id)
    )

    toast.success(
      response.data?.message || 'User deleted successfully'
    )

    return {
      success: true,
    }
  } catch (error) {
    console.error('Admin delete user error:', error)

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Could not delete user'

    toast.error(message)

    return {
      success: false,
      error: message,
    }
  } finally {
    setLoading(false)
  }
}

  // =========================================================
  // UPDATE CURRENT USER
  // =========================================================

  const updateUser = async (updatedData) => {
    setLoading(true)

    try {
      const response = await userAPI.updateProfile(updatedData)

      const updatedUser = response.data?.data

      if (!updatedUser) {
        throw new Error('Invalid profile response from server')
      }

      setUser(updatedUser)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      toast.success(
        response.data?.message || 'Profile updated successfully'
      )

      return {
        success: true,
        user: updatedUser,
      }
    } catch (error) {
      console.error('Profile update error:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Profile update failed'

      toast.error(message)

      return {
        success: false,
        error: message,
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // UPDATE CURRENT USER PASSWORD
  // =========================================================

  const changePassword = async (passwordData) => {
    setLoading(true)

    try {
      const response = await userAPI.changePassword(passwordData)

      toast.success(
        response.data?.message || 'Password changed successfully'
      )

      return {
        success: true,
      }
    } catch (error) {
      console.error('Change password error:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Password change failed'

      toast.error(message)

      return {
        success: false,
        error: message,
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // UPDATE CURRENT USER AVATAR
  // =========================================================
  const uploadAvatar = async (file) => {
    setLoading(true)

    try {
      const formData = new FormData()

      formData.append('avatar', file)

      const response = await userAPI.uploadAvatar(formData)

      const updatedUser = response.data?.data

      if (updatedUser) {
        setUser(updatedUser)

        localStorage.setItem(
          'user',
          JSON.stringify(updatedUser)
        )
      }

      toast.success(
        response.data?.message || 'Avatar updated successfully'
      )

      return {
        success: true,
        user: updatedUser,
      }
    } catch (error) {
      console.error('Avatar upload error:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Avatar upload failed'

      toast.error(message)

      return {
        success: false,
        error: message,
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // UPDATE CURRENT USER SETTING
  // =========================================================

  const updateSettings = async (settingsData) => {
    setLoading(true)

    try {
      const response = await userAPI.updateSettings(settingsData)

      toast.success(
        response.data?.message || 'Settings updated successfully'
      )

      return {
        success: true,
        settings: response.data?.data,
      }
    } catch (error) {
      console.error('Settings update error:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Settings update failed'

      toast.error(message)

      return {
        success: false,
        error: message,
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value = {
    user,
    users,

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

    expertRequests,

    adminAddUser,
    adminUpdateUser,
    adminDeleteUser,

    isSeller: !!user?.isSeller,

    isAdmin:
      user?.role === 'admin' ||
      user?.role === 'ADMIN',

    isFarmer:
      user?.role === 'farmer' ||
      user?.role === 'FARMER',

    isExpert:
      user?.role === 'expert' ||
      user?.role === 'EXPERT',

    expertRequestStatus:
      user?.expertRequestStatus || null,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
