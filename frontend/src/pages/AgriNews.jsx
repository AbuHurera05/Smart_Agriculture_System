import { useState } from 'react'
import { Calendar, User, ChevronRight, X } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useDataStore from '../store/useDataStore'

export default function AgriNews() {
  const { news } = useDataStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openArticle, setOpenArticle] = useState(null)

  const categories = ['All', 'Technology', 'Market', 'Policy', 'Research', 'Events']

  // Farmers and Experts only ever see published news.
  const publishedNews = news.filter((n) => n.status === 'published')

  const filteredNews = selectedCategory === 'all'
    ? publishedNews
    : publishedNews.filter(n => n.category.toLowerCase() === selectedCategory.toLowerCase())

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

      {filteredNews.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">No published news in this category yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <Card key={item.id} hover className="cursor-pointer" onClick={() => setOpenArticle(item)}>
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
      )}

      {openArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="badge badge-info text-xs">{openArticle.category}</span>
                <button onClick={() => setOpenArticle(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-5xl mb-3">{openArticle.image}</div>
              <h2 className="text-2xl font-bold mb-2">{openArticle.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {openArticle.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {openArticle.date}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{openArticle.content || openArticle.summary}</p>
              <Button variant="secondary" className="mt-6 w-full" onClick={() => setOpenArticle(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
