import { useState } from 'react'
import { Calendar, User, Tag, ChevronRight } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function AgriNews() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['All', 'Technology', 'Market', 'Policy', 'Research', 'Events']
  
  const news = [
    {
      id: 1,
      title: 'Government Announces New Subsidy Scheme for Farmers',
      summary: 'The new scheme provides 50% subsidy on smart irrigation systems...',
      category: 'Policy',
      author: 'Agriculture Ministry',
      date: '2024-03-15',
      image: '📰',
    },
    {
      id: 2,
      title: 'AI-Powered Crop Disease Detection Shows 95% Accuracy',
      summary: 'New machine learning model can detect crop diseases from smartphone images...',
      category: 'Technology',
      author: 'Tech Times',
      date: '2024-03-14',
      image: '🤖',
    },
    {
      id: 3,
      title: 'Organic Farming Summit 2024 Announced',
      summary: 'Leading experts to gather for annual organic farming conference...',
      category: 'Events',
      author: 'Event Organizers',
      date: '2024-03-13',
      image: '🌱',
    },
    {
      id: 4,
      title: 'Wheat Prices Hit Record High',
      summary: 'Global demand drives wheat prices to 5-year high...',
      category: 'Market',
      author: 'Financial Times',
      date: '2024-03-12',
      image: '📈',
    },
  ]

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(n => n.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agricultural News</h1>
        <p className="text-gray-600 mt-1">Latest updates and insights from the agricultural world</p>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat.toLowerCase())}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat.toLowerCase()
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <Card key={item.id} hover className="cursor-pointer">
            <div className="flex gap-4">
              <div className="text-4xl">{item.image}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-info text-xs">{item.category}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3">{item.summary}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 self-center" />
            </div>
          </Card>
        ))}
      </div>
      
      <Button variant="secondary" className="w-full">
        Load More News
      </Button>
    </div>
  )
}