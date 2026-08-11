import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
}

// Admin endpoints
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),

  createUser: (data) =>
    api.post('/admin/users', data),

  updateUser: (id, data) =>
    api.put(`/admin/users/${id}`, data),

  deleteUser: (id) =>
    api.delete(`/admin/users/${id}`),
}

export const cropAPI = {
  getAllCrops: () => api.get('/crops'),
  getCropById: (id) => api.get(`/crops/${id}`),
  getRecommendations: (data) => api.post('/crops/recommendations', data),
}

export const weatherAPI = {
  getCurrentWeather: (location) => api.get(`/weather/current?location=${location}`),
  getForecast: (location) => api.get(`/weather/forecast?location=${location}`),
}

export const iotAPI = {
  getSensorData: () => api.get('/iot/sensors'),
  getHistoricalData: (params) => api.get('/iot/history', { params }),
  controlIrrigation: (data) => api.post('/iot/irrigation/control', data),
}

export const chatbotAPI = {
  sendMessage: (message, history = []) => api.post('/chatbot/message', { message, history }),
  getSuggestions: () => api.get('/chatbot/suggestions'),
}

export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateSettings: (data) => api.put('/users/settings', data),
}

export const newsAPI = {
  getNews: () => api.get('/news'),
  getNewsById: (id) => api.get(`/news/${id}`),
}


// ---------------- Marketplace ----------------
export const marketplaceAPI = {
  // Products
  getProducts: (params) => api.get('/marketplace/products', { params }),
  getProductById: (id) => api.get(`/marketplace/products/${id}`),
  createProduct: (data) => api.post('/marketplace/products', data),
  updateProduct: (id, data) => api.put(`/marketplace/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/marketplace/products/${id}`),
  getMyListings: () => api.get('/marketplace/products/my-listings'),
  getCategories: () => api.get('/marketplace/categories'),

  // Seller onboarding
  becomeSeller: (data) => api.post('/marketplace/sellers/register', data),
  getSellerProfile: (id) => api.get(`/marketplace/sellers/${id}`),

  // Cart & Orders
  createOrder: (data) => api.post('/marketplace/orders', data),
  getMyOrders: () => api.get('/marketplace/orders/my-orders'),
  getSellerOrders: () => api.get('/marketplace/orders/seller-orders'),
  getOrderById: (id) => api.get(`/marketplace/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/marketplace/orders/${id}/status`, { status }),

  // Reviews
  addProductReview: (productId, data) => api.post(`/marketplace/products/${productId}/reviews`, data),
}

export default api