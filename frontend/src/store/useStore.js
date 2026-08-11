import { create } from 'zustand'

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) return saved === 'true'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

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
  mobileSidebarOpen: false,
  darkMode: getInitialDarkMode(),

  // Notifications
  notifications: [],

  // Marketplace cart state
  // Each item: { productId, title, price, unit, qty, sellerId, sellerName, image, stock }
  cartItems: [],

  // Actions
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, cartItems: [] }),

  updateSensorData: (data) => set({ sensorData: data }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
  toggleDarkMode: () => set((state) => {
    const next = !state.darkMode
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(next))
      document.documentElement.classList.toggle('dark', next)
    }
    return { darkMode: next }
  }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50)
    })),

  clearNotifications: () => set({ notifications: [] }),

  // Marketplace cart actions
  addToCart: (item) =>
    set((state) => {
      const existing = state.cartItems.find((c) => c.productId === item.productId)
      if (existing) {
        return {
          cartItems: state.cartItems.map((c) =>
            c.productId === item.productId
              ? { ...c, qty: Math.min(c.qty + item.qty, c.stock ?? Infinity) }
              : c
          ),
        }
      }
      return { cartItems: [...state.cartItems, item] }
    }),

  updateCartQty: (productId, qty) =>
    set((state) => ({
      cartItems: state.cartItems.map((c) =>
        c.productId === productId ? { ...c, qty: Math.max(1, qty) } : c
      ),
    })),

  removeFromCart: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((c) => c.productId !== productId),
    })),

  clearCart: () => set({ cartItems: [] }),
}))

export default useStore
