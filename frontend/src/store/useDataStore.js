// import { create } from 'zustand'
// const seedNews = [
//   {
//     id: 1,
//     title: 'Government Announces New Subsidy Scheme for Farmers',
//     summary: 'The new scheme provides 50% subsidy on smart irrigation systems for small and marginal farmers.',
//     content: 'The new scheme provides 50% subsidy on smart irrigation systems for small and marginal farmers. Applications open next month through the local agriculture office.',
//     category: 'Policy',
//     author: 'Agriculture Ministry',
//     date: '2024-03-15',
//     image: '📰',
//     status: 'published',
//     views: 1245,
//   },
//   {
//     id: 2,
//     title: 'AI-Powered Crop Disease Detection Shows 95% Accuracy',
//     summary: 'New machine learning model can detect crop diseases from smartphone images.',
//     content: 'New machine learning model can detect crop diseases from smartphone images with 95% accuracy, allowing farmers to catch outbreaks early and reduce crop loss.',
//     category: 'Technology',
//     author: 'Tech Times',
//     date: '2024-03-14',
//     image: '🤖',
//     status: 'published',
//     views: 892,
//   },
//   {
//     id: 3,
//     title: 'Organic Farming Summit 2024 Announced',
//     summary: 'Leading experts to gather for annual organic farming conference.',
//     content: 'Leading experts will gather for the annual organic farming conference to discuss soil health, certification and market access for organic produce.',
//     category: 'Events',
//     author: 'Event Organizers',
//     date: '2024-03-13',
//     image: '🌱',
//     status: 'published',
//     views: 431,
//   },
//   {
//     id: 4,
//     title: 'Wheat Prices Hit Record High',
//     summary: 'Global demand drives wheat prices to 5-year high.',
//     content: 'Global demand drives wheat prices to a 5-year high, giving wheat growers improved margins this season.',
//     category: 'Market',
//     author: 'Financial Times',
//     date: '2024-03-12',
//     image: '📈',
//     status: 'published',
//     views: 705,
//   },
//   {
//     id: 5,
//     title: 'Draft: New Pest Advisory for Cotton Belt',
//     summary: 'Upcoming advisory on pink bollworm management for cotton growing regions.',
//     content: 'Draft advisory covering pink bollworm management practices for the upcoming cotton season. Pending final review before publishing.',
//     category: 'Research',
//     author: 'Admin User',
//     date: '2024-03-20',
//     image: '🐛',
//     status: 'draft',
//     views: 0,
//   },
// ]

// const useDataStore = create((set, get) => ({
//   // ---------------- News ----------------
//   news: seedNews,

//   addNews: (item) =>
//     set((state) => {
//       const newId = Math.max(0, ...state.news.map((n) => n.id)) + 1
//       return { news: [{ ...item, id: newId, views: 0 }, ...state.news] }
//     }),

//   updateNews: (id, updates) =>
//     set((state) => ({
//       news: state.news.map((n) => (n.id === id ? { ...n, ...updates } : n)),
//     })),

//   deleteNews: (id) =>
//     set((state) => ({ news: state.news.filter((n) => n.id !== id) })),

//   togglePublishNews: (id) =>
//     set((state) => ({
//       news: state.news.map((n) =>
//         n.id === id ? { ...n, status: n.status === 'published' ? 'draft' : 'published' } : n
//       ),
//     })),
// }))

// export default useDataStore

import { create } from 'zustand'
import { newsAPI } from '../services/api'

// ---------------------------------------------------------------------------
// news-service (GET /news, GET /news/{id}) only exposes read endpoints - it
// returns published articles only, and has no create/update/delete/publish
// endpoints yet. So the `news` list itself now comes from the real backend
// (fetchNews), but the admin add/update/delete/toggle-publish actions below
// are still local/in-memory only until news-service grows write endpoints.
//
// Training Workshops used to live here too, but now come from the real
// expert-service backend (see services/api.js -> workshopAPI and
// utils/workshopMapper.js) via TrainingWorkshops.jsx, ExpertDashboard.jsx
// and AdminPanel.jsx.
// ---------------------------------------------------------------------------

const useDataStore = create((set, get) => ({
  // ---------------- News ----------------
  news: [],
  newsLoading: false,

  // GET /news -> NewsController.getNews() (public, published articles only)
  fetchNews: async () => {
    set({ newsLoading: true })
    try {
      const response = await newsAPI.getNews()
      set({ news: response.data?.data || [] })
      return { success: true }
    } catch (error) {
      console.error('Fetch news error:', error)
      return { success: false, error }
    } finally {
      set({ newsLoading: false })
    }
  },

  // NOTE: news-service has no admin write endpoints yet (no POST/PUT/DELETE
  // /news), so these stay local-only for now and won't persist server-side.
  addNews: (item) =>
    set((state) => {
      const newId = Math.max(0, ...state.news.map((n) => n.id)) + 1
      return { news: [{ ...item, id: newId, views: 0 }, ...state.news] }
    }),

  updateNews: (id, updates) =>
    set((state) => ({
      news: state.news.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),

  deleteNews: (id) =>
    set((state) => ({ news: state.news.filter((n) => n.id !== id) })),

  togglePublishNews: (id) =>
    set((state) => ({
      news: state.news.map((n) =>
        n.id === id ? { ...n, status: n.status === 'published' ? 'draft' : 'published' } : n
      ),
    })),
}))

export default useDataStore