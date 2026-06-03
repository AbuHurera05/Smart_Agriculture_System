import React, { createContext, useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast'

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
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@smartagri.com',
      password: 'admin123',
      role: 'admin',
      avatar: '👨‍💼',
      phone: '+91 9876543210',
      joinDate: '2024-01-01',
      farmSize: 'N/A',
      location: 'Headquarters'
    },
    {
      id: 2,
      name: 'John Farmer',
      email: 'farmer@smartagri.com',
      password: 'farmer123',
      role: 'farmer',
      avatar: '👨‍🌾',
      phone: '+91 9876543211',
      joinDate: '2024-01-15',
      farmSize: '15 acres',
      location: 'Punjab, India',
      crops: ['Rice', 'Wheat']
    },
    {
      id: 3,
      name: 'Dr. Sarah Wilson',
      email: 'expert@smartagri.com',
      password: 'expert123',
      role: 'expert',
      avatar: '👩‍🔬',
      phone: '+91 9876543212',
      joinDate: '2024-01-20',
      specialization: 'Crop Disease',
      experience: '8 years',
      location: 'Agricultural University'
    }
  ])

  useEffect(() => {
    // Check localStorage for saved session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundUser = users.find(u => u.email === email && u.password === password)
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))
        toast.success(`Welcome back, ${foundUser.name}!`)
        return { success: true, user: userWithoutPassword }
      } else {
        toast.error('Invalid email or password')
        return { success: false, error: 'Invalid credentials' }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const existingUser = users.find(u => u.email === userData.email)
      if (existingUser) {
        toast.error('Email already registered')
        return { success: false, error: 'Email already exists' }
      }
      
      const newUser = {
        id: users.length + 1,
        ...userData,
        role: 'farmer',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: '👨‍🌾'
      }
      
      setUsers([...users, newUser])
      toast.success('Registration successful! Please login.')
      return { success: true }
    } catch (error) {
      toast.error('Registration failed')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
  }

  const updateUser = async (updatedData) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const updatedUser = { ...user, ...updatedData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      toast.success('Profile updated successfully')
      return { success: true }
    } catch (error) {
      toast.error('Update failed')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin: user?.role === 'admin',
    isFarmer: user?.role === 'farmer',
    isExpert: user?.role === 'expert'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}