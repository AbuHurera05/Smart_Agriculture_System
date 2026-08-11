import { useState } from 'react'
import { 
  GraduationCap, Calendar, MapPin, Users, Clock, Video,
  Award, Search, Star, TrendingUp, ExternalLink, UserPlus
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useDataStore from '../store/useDataStore'
import { useAuthContext } from '../context/AuthContext'

export default function TrainingWorkshops() {
  const { user } = useAuthContext()
  const { workshops, enrollInWorkshop } = useDataStore()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const certifications = [
    { name: 'Organic Farming Certification', duration: '3 months', level: 'Advanced', provider: 'NABARD' },
    { name: 'Smart Agriculture Specialist', duration: '2 months', level: 'Intermediate', provider: 'Microsoft' },
    { name: 'Precision Farming Expert', duration: '1 month', level: 'Beginner', provider: 'IIT Delhi' },
  ]

  // Farmers only see live sessions that experts have published (not completed ones)
  const visibleWorkshops = workshops.filter(w => w.status !== 'completed')

  const filteredWorkshops = visibleWorkshops.filter(w => 
    (filter === 'all' || w.type === filter) &&
    (searchTerm === '' || w.title.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleEnroll = (workshop) => {
    if (workshop.enrolled >= workshop.capacity) {
      toast.error('This session is full')
      return
    }
    enrollInWorkshop(workshop.id)
    toast.success(`Enrolled in "${workshop.title}"`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training & Workshops</h1>
        <p className="text-gray-600 mt-1">Enhance your farming skills with expert-led training</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{visibleWorkshops.length}</p>
              <p className="text-sm text-gray-500">Active Workshops</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{visibleWorkshops.reduce((sum, w) => sum + (w.enrolled || 0), 0)}</p>
              <p className="text-sm text-gray-500">Farmers Enrolled</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{certifications.length}</p>
              <p className="text-sm text-gray-500">Certifications</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">35%</p>
              <p className="text-sm text-gray-500">Yield Improvement</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search workshops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'online', 'in-person'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Workshops Grid */}
      {filteredWorkshops.length === 0 ? (
        <Card className="text-center py-12">
          <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No workshops match your search yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWorkshops.map(workshop => (
            <Card key={workshop.id} hover>
              <div className="flex gap-4">
                <div className="text-5xl">{workshop.image}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{workshop.title}</h3>
                      <p className="text-sm text-gray-600">by {workshop.instructor}</p>
                    </div>
                    {workshop.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{workshop.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{workshop.date}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{workshop.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{workshop.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{workshop.enrolled}/{workshop.capacity} enrolled</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(workshop.topics || []).map((topic, idx) => (
                      <span key={idx} className="badge badge-info text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">{workshop.price}</span>
                      {workshop.price !== 'Free' && <span className="text-xs text-gray-500"> per person</span>}
                    </div>
                    <Button variant="primary" size="sm" onClick={() => handleEnroll(workshop)}>
                      {workshop.type === 'online' ? <Video className="w-4 h-4 mr-1" /> : <UserPlus className="w-4 h-4 mr-1" />}
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Certifications Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Available Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <Card key={idx} hover>
              <Award className="w-12 h-12 text-primary mb-3" />
              <h3 className="font-semibold text-lg">{cert.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Duration: {cert.duration}</p>
                <p>Level: {cert.level}</p>
                <p>Provider: {cert.provider}</p>
              </div>
              <Button variant="secondary" size="sm" className="mt-4 w-full">
                Learn More
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
