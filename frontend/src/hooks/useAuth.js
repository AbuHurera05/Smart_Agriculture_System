import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import useStore from '../store/useStore'

export const useAuth = () => {
  const navigate = useNavigate()
  const { setUser, logout } = useStore()
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      toast.success('Login successful!')
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return { success: false, error: error.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const response = await authAPI.register(userData)
      toast.success('Registration successful! Please login.')
      navigate('/login')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return { success: false, error: error.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return { login, register, logout: handleLogout, loading }
}