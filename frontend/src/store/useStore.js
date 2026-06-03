import { create } from 'zustand'

const useStore = create((set) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  
  // Sensor data
  sensorData: {
    moisture: 0,
    temperature: 0,
    humidity: 0,
    ph: 0,
    timestamp: null,
  },
  
  // UI state
  sidebarOpen: true,
  darkMode: false,
  
  // Notifications
  notifications: [],
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  
  updateSensorData: (data) => set({ sensorData: data }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  
  addNotification: (notification) => 
    set((state) => ({ 
      notifications: [notification, ...state.notifications].slice(0, 50) 
    })),
  
  clearNotifications: () => set({ notifications: [] }),
}))

export default useStore