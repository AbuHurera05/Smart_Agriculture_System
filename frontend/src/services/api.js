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

export const newsAPI = {
  getNews: () => api.get('/news'),
  getNewsById: (id) => api.get(`/news/${id}`),
}

export default api