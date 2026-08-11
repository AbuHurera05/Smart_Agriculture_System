import { create } from 'zustand'

// ---------------------------------------------------------------------------
// Centralized "mock backend" for data that is shared across roles:
// Agricultural News (managed by Admin, viewed by Farmers/Experts) and
// Training Workshops (created by Experts, moderated by Admin, viewed by
// Farmers). In production these would be fetched from a real API
// (e.g. GET/POST /api/news, /api/workshops) — kept here as a single
// in-memory source of truth so every page reflects the same data.
// ---------------------------------------------------------------------------

const seedNews = [
  {
    id: 1,
    title: 'Government Announces New Subsidy Scheme for Farmers',
    summary: 'The new scheme provides 50% subsidy on smart irrigation systems for small and marginal farmers.',
    content: 'The new scheme provides 50% subsidy on smart irrigation systems for small and marginal farmers. Applications open next month through the local agriculture office.',
    category: 'Policy',
    author: 'Agriculture Ministry',
    date: '2024-03-15',
    image: '📰',
    status: 'published',
    views: 1245,
  },
  {
    id: 2,
    title: 'AI-Powered Crop Disease Detection Shows 95% Accuracy',
    summary: 'New machine learning model can detect crop diseases from smartphone images.',
    content: 'New machine learning model can detect crop diseases from smartphone images with 95% accuracy, allowing farmers to catch outbreaks early and reduce crop loss.',
    category: 'Technology',
    author: 'Tech Times',
    date: '2024-03-14',
    image: '🤖',
    status: 'published',
    views: 892,
  },
  {
    id: 3,
    title: 'Organic Farming Summit 2024 Announced',
    summary: 'Leading experts to gather for annual organic farming conference.',
    content: 'Leading experts will gather for the annual organic farming conference to discuss soil health, certification and market access for organic produce.',
    category: 'Events',
    author: 'Event Organizers',
    date: '2024-03-13',
    image: '🌱',
    status: 'published',
    views: 431,
  },
  {
    id: 4,
    title: 'Wheat Prices Hit Record High',
    summary: 'Global demand drives wheat prices to 5-year high.',
    content: 'Global demand drives wheat prices to a 5-year high, giving wheat growers improved margins this season.',
    category: 'Market',
    author: 'Financial Times',
    date: '2024-03-12',
    image: '📈',
    status: 'published',
    views: 705,
  },
  {
    id: 5,
    title: 'Draft: New Pest Advisory for Cotton Belt',
    summary: 'Upcoming advisory on pink bollworm management for cotton growing regions.',
    content: 'Draft advisory covering pink bollworm management practices for the upcoming cotton season. Pending final review before publishing.',
    category: 'Research',
    author: 'Admin User',
    date: '2024-03-20',
    image: '🐛',
    status: 'draft',
    views: 0,
  },
]

const seedWorkshops = [
  {
    id: 1,
    title: 'Advanced Organic Farming Techniques',
    instructor: 'Dr. Rajesh Kumar',
    instructorId: 3,
    date: '2024-04-15',
    time: '10:00 AM - 4:00 PM',
    venue: 'Agricultural University, Ludhiana',
    type: 'in-person',
    capacity: 50,
    enrolled: 32,
    price: 'Free',
    rating: 4.8,
    image: '🌱',
    topics: ['Composting', 'Natural Pest Control', 'Crop Rotation'],
    status: 'upcoming',
    description: 'A hands-on workshop covering composting, natural pest control and crop rotation for organic yields.',
  },
  {
    id: 2,
    title: 'Smart Irrigation Systems',
    instructor: 'Dr. Sarah Wilson',
    instructorId: 3,
    date: '2024-04-20',
    time: '2:00 PM - 5:00 PM',
    venue: 'Online (Zoom)',
    type: 'online',
    capacity: 100,
    enrolled: 67,
    price: '₹499',
    rating: 4.9,
    image: '💧',
    topics: ['Drip Irrigation', 'Sensor Integration', 'Water Management'],
    status: 'upcoming',
    description: 'Learn to design and manage sensor-driven drip irrigation systems that save water.',
  },
  {
    id: 3,
    title: 'Crop Disease Detection Using AI',
    instructor: 'Dr. Amit Sharma',
    instructorId: 3,
    date: '2024-04-25',
    time: '11:00 AM - 2:00 PM',
    venue: 'Online (Zoom)',
    type: 'online',
    capacity: 150,
    enrolled: 98,
    price: '₹299',
    rating: 4.7,
    image: '🤖',
    topics: ['Machine Learning', 'Image Recognition', 'Early Detection'],
    status: 'upcoming',
    description: 'An introduction to using AI image recognition to catch crop disease early.',
  },
  {
    id: 4,
    title: 'Sustainable Farming Practices',
    instructor: 'Dr. Priya Mehta',
    instructorId: 3,
    date: '2024-05-05',
    time: '9:00 AM - 5:00 PM',
    venue: 'Community Center, Delhi',
    type: 'in-person',
    capacity: 75,
    enrolled: 45,
    price: '₹799',
    rating: 4.6,
    image: '🌍',
    topics: ['Soil Conservation', 'Water Harvesting', 'Biodiversity'],
    status: 'upcoming',
    description: 'A full-day session on soil conservation, water harvesting and biodiversity practices.',
  },
]

const useDataStore = create((set, get) => ({
  // ---------------- News ----------------
  news: seedNews,

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

  // ---------------- Workshops ----------------
  workshops: seedWorkshops,

  addWorkshop: (item) =>
    set((state) => {
      const newId = Math.max(0, ...state.workshops.map((w) => w.id)) + 1
      return { workshops: [{ enrolled: 0, rating: 0, status: 'upcoming', ...item, id: newId }, ...state.workshops] }
    }),

  updateWorkshop: (id, updates) =>
    set((state) => ({
      workshops: state.workshops.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    })),

  deleteWorkshop: (id) =>
    set((state) => ({ workshops: state.workshops.filter((w) => w.id !== id) })),

  enrollInWorkshop: (id) =>
    set((state) => ({
      workshops: state.workshops.map((w) =>
        w.id === id && w.enrolled < w.capacity ? { ...w, enrolled: w.enrolled + 1 } : w
      ),
    })),

  workshopsByInstructor: (instructorId) => get().workshops.filter((w) => w.instructorId === instructorId),
}))

export default useDataStore
