import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// =========================================================
// AUTH  ->  AuthController  (/auth)
// =========================================================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  googleLogin: () => {
    window.location.href =
      `${API_BASE_URL}/oauth2/authorization/google`
  },
}

// =========================================================
// CURRENT USER  ->  UserController  (/users)
// =========================================================
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  updateSettings: (data) => api.put('/users/settings', data),
  uploadAvatar: (formData) =>
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

// =========================================================
// ADMIN: USER MANAGEMENT  ->  AdminController  (/admin/users)
// =========================================================
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}

// =========================================================
// EXPERT APPLICATIONS  ->  ExpertController  (/experts)
// =========================================================
export const expertAPI = {
  apply: (data) => api.post('/experts/apply', data),
  getAllRequests: () => api.get('/experts/requests'),
  approve: (id) => api.put(`/experts/requests/${id}/approve`),
  reject: (id) => api.put(`/experts/requests/${id}/reject`),
}

// =========================================================
// WORKSHOPS  ->  WorkshopController  (/experts/workshops)
// =========================================================
export const workshopAPI = {
  getAll: (params) => api.get('/experts/workshops', { params }),
  getById: (id) => api.get(`/experts/workshops/${id}`),
  getMyWorkshops: () => api.get('/experts/workshops/my'), // EXPERT/ADMIN
  getMyEnrollments: () => api.get('/experts/workshops/my-enrollments'), // FARMER
  create: (data) => api.post('/experts/workshops', data), // EXPERT/ADMIN
  update: (id, data) => api.put(`/experts/workshops/${id}`, data), // EXPERT/ADMIN
  delete: (id) => api.delete(`/experts/workshops/${id}`), // EXPERT/ADMIN
  enroll: (id) => api.post(`/experts/workshops/${id}/enroll`), // FARMER
  unenroll: (id) => api.delete(`/experts/workshops/${id}/enroll`), // FARMER
  getEnrollments: (id) => api.get(`/experts/workshops/${id}/enrollments`), // EXPERT/ADMIN
}

// =========================================================
// CROPS  ->  CropController  (/crops)
// =========================================================
export const cropAPI = {
  getAllCrops: () => api.get('/crops'),
  getCropById: (id) => api.get(`/crops/${id}`),
  getRecommendations: (data) => api.post('/crops/recommendations', data),
}

// =========================================================
// WEATHER  ->  WeatherController  (/weather)
// =========================================================
export const weatherAPI = {
  getCurrentWeather: (location) => api.get('/weather/current', { params: { location } }),
  getForecast: (location) => api.get('/weather/forecast', { params: { location } }),
}

// =========================================================
// IOT / IRRIGATION  ->  IotController  (/iot)
// =========================================================
export const iotAPI = {
  getSensorData: () => api.get('/iot/sensors'),
  getHistoricalData: (params) => api.get('/iot/history', { params }),
  controlIrrigation: (data) => api.post('/iot/irrigation/control', data),
}

// =========================================================
// CHATBOT  ->  ChatbotController  (/chatbot)
// =========================================================
export const chatbotAPI = {
  sendMessage: (message, history = []) => api.post('/chatbot/message', { message, history }),
  getSuggestions: () => api.get('/chatbot/suggestions'),
}

// =========================================================
// NEWS  ->  NewsController  (/news)
// =========================================================
export const newsAPI = {
  getNews: () => api.get('/news'),
  getNewsById: (id) => api.get(`/news/${id}`),
}

// =========================================================
// MARKETPLACE  ->  ProductController, OrderController, SellerController
// =========================================================
export const marketplaceAPI = {
  // Products  (/marketplace/products)
  getProducts: (params) => api.get('/marketplace/products', { params }),
  getProductById: (id) => api.get(`/marketplace/products/${id}`),
  getMyListings: () => api.get('/marketplace/products/my-listings'),
  createProduct: (data) => api.post('/marketplace/products', data),
  updateProduct: (id, data) => api.put(`/marketplace/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/marketplace/products/${id}`),
  addProductReview: (productId, data) => api.post(`/marketplace/products/${productId}/reviews`, data),

  // Categories  (/marketplace/categories)
  getCategories: () => api.get('/marketplace/categories'),

  // Seller onboarding  (/marketplace/sellers)
  becomeSeller: (data) => api.post('/marketplace/sellers/register', data),
  getSellerProfile: (id) => api.get(`/marketplace/sellers/${id}`),

  // Orders  (/marketplace/orders)
  createOrder: (data) => api.post('/marketplace/orders', data),
  getMyOrders: () => api.get('/marketplace/orders/my-orders'),
  getSellerOrders: () => api.get('/marketplace/orders/seller-orders'),
  getOrderById: (id) => api.get(`/marketplace/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/marketplace/orders/${id}/status`, { status }),
}

export default api