import { useState } from 'react'
import { 
  GraduationCap, Calendar, MapPin, Users, Clock, Video,
  BookOpen, Award, Filter, Search, Star, TrendingUp,
  CheckCircle, ExternalLink, UserPlus
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function TrainingWorkshops() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const workshops = [
    {
      id: 1,
      title: 'Advanced Organic Farming Techniques',
      instructor: 'Dr. Rajesh Kumar',
      date: '2024-04-15',
      time: '10:00 AM - 4:00 PM',
      venue: 'Agricultural University, Ludhiana',
      type: 'in-person',
      capacity: 50,
      enrolled: 32,
      price: 'Free',
      rating: 4.8,
      image: '🌱',
      topics: ['Composting', 'Natural Pest Control', 'Crop Rotation']
    },
    {
      id: 2,
      title: 'Smart Irrigation Systems',
      instructor: 'Prof. Sarah Wilson',
      date: '2024-04-20',
      time: '2:00 PM - 5:00 PM',
      venue: 'Online (Zoom)',
      type: 'online',
      capacity: 100,
      enrolled: 67,
      price: '₹499',
      rating: 4.9,
      image: '💧',
      topics: ['Drip Irrigation', 'Sensor Integration', 'Water Management']
    },
    {
      id: 3,
      title: 'Crop Disease Detection Using AI',
      instructor: 'Dr. Amit Sharma',
      date: '2024-04-25',
      time: '11:00 AM - 2:00 PM',
      venue: 'Online (Zoom)',
      type: 'online',
      capacity: 150,
      enrolled: 98,
      price: '₹299',
      rating: 4.7,
      image: '🤖',
      topics: ['Machine Learning', 'Image Recognition', 'Early Detection']
    },
    {
      id: 4,
      title: 'Sustainable Farming Practices',
      instructor: 'Dr. Priya Mehta',
      date: '2024-05-05',
      time: '9:00 AM - 5:00 PM',
      venue: 'Community Center, Delhi',
      type: 'in-person',
      capacity: 75,
      enrolled: 45,
      price: '₹799',
      rating: 4.6,
      image: '🌍',
      topics: ['Soil Conservation', 'Water Harvesting', 'Biodiversity']
    }
  ]

  const certifications = [
    { name: 'Organic Farming Certification', duration: '3 months', level: 'Advanced', provider: 'NABARD' },
    { name: 'Smart Agriculture Specialist', duration: '2 months', level: 'Intermediate', provider: 'Microsoft' },
    { name: 'Precision Farming Expert', duration: '1 month', level: 'Beginner', provider: 'IIT Delhi' },
  ]

  const filteredWorkshops = workshops.filter(w => 
    (filter === 'all' || w.type === filter) &&
    (searchTerm === '' || w.title.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-500">Active Workshops</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">2,345</p>
              <p className="text-sm text-gray-500">Farmers Trained</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">8</p>
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
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{workshop.rating}</span>
                  </div>
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
                  {workshop.topics.map((topic, idx) => (
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
                  <Button variant="primary" size="sm">
                    {workshop.type === 'online' ? <Video className="w-4 h-4 mr-1" /> : <UserPlus className="w-4 h-4 mr-1" />}
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

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

      {/* Upcoming Events Calendar */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">15</p>
                <p className="text-xs">Apr</p>
              </div>
              <div>
                <p className="font-medium">Webinar: Sustainable Agriculture</p>
                <p className="text-sm text-gray-500">10:00 AM - 12:00 PM</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">Remind Me</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">22</p>
                <p className="text-xs">Apr</p>
              </div>
              <div>
                <p className="font-medium">Field Visit: Smart Farm Demo</p>
                <p className="text-sm text-gray-500">2:00 PM - 5:00 PM</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">Remind Me</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}