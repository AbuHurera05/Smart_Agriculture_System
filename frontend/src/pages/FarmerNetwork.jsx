import { useState } from 'react'
import { 
  Users, MessageCircle, Share2, Heart, UserPlus, Search, 
  Filter, MapPin, Star, Award, Calendar, Image as ImageIcon,
  Send, ThumbsUp, MoreVertical, Globe, Lock, Users as UsersIcon
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function FarmerNetwork() {
  const [activeTab, setActiveTab] = useState('feed')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPostModal, setShowPostModal] = useState(false)
  const [postContent, setPostContent] = useState('')

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: 'Rajesh Kumar',
        avatar: '👨‍🌾',
        location: 'Punjab, India',
        role: 'Farmer',
        crops: ['Wheat', 'Rice']
      },
      content: 'Just harvested my wheat crop! Great yield this season thanks to the smart irrigation advice. 🌾',
      images: [],
      likes: 45,
      comments: 12,
      shares: 8,
      timestamp: '2 hours ago',
      liked: false
    },
    {
      id: 2,
      user: {
        name: 'Dr. Priya Sharma',
        avatar: '👩‍🔬',
        location: 'Agricultural University',
        role: 'Agronomist',
        specialization: 'Crop Disease'
      },
      content: 'Important: Early warning for pest infestation in northern regions. Farmers please check your crops for signs of fall armyworm. Preventive measures available in the crop advisory section.',
      images: ['🐛', '🌾'],
      likes: 128,
      comments: 34,
      shares: 56,
      timestamp: '5 hours ago',
      liked: true
    },
    {
      id: 3,
      user: {
        name: 'Green Fields Co-op',
        avatar: '🏢',
        location: 'Maharashtra',
        role: 'Cooperative',
        members: 245
      },
      content: 'Weekly market update: Tomato prices up 15%, Onion prices stable. Best selling time is early morning.',
      images: [],
      likes: 67,
      comments: 23,
      shares: 31,
      timestamp: '1 day ago',
      liked: false
    }
  ])

  const [suggestedFarmers] = useState([
    { id: 1, name: 'Amit Patel', location: 'Gujarat', crops: ['Cotton'], mutual: 5, avatar: '👨‍🌾' },
    { id: 2, name: 'Sunita Reddy', location: 'Karnataka', crops: ['Ragi'], mutual: 3, avatar: '👩‍🌾' },
    { id: 3, name: 'Organic Farms Co.', location: 'Kerala', crops: ['Spices'], mutual: 8, avatar: '🏢' },
  ])

  const [groups] = useState([
    { id: 1, name: 'Organic Farming India', members: 1234, posts: 45, privacy: 'public', icon: '🌱' },
    { id: 2, name: 'Wheat Farmers Association', members: 567, posts: 23, privacy: 'private', icon: '🌾' },
    { id: 3, name: 'Smart Irrigation Users', members: 890, posts: 67, privacy: 'public', icon: '💧' },
  ])

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
        : post
    ))
  }

  const handlePost = () => {
    if (postContent.trim()) {
      const newPost = {
        id: Date.now(),
        user: {
          name: 'You',
          avatar: '👤',
          location: 'Your Farm',
          role: 'Farmer'
        },
        content: postContent,
        images: [],
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: 'Just now',
        liked: false
      }
      setPosts([newPost, ...posts])
      setPostContent('')
      setShowPostModal(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Farmer Network</h1>
        <p className="text-gray-600 mt-1">Connect, share, and learn from the farming community</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {['feed', 'groups', 'farmers', 'events'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Create Post */}
            <Card className="cursor-pointer" onClick={() => setShowPostModal(true)}>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xl">
                  👤
                </div>
                <div className="flex-1">
                  <p className="text-gray-500">Share your farming experience...</p>
                </div>
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t">
                <button className="flex items-center gap-2 text-gray-500 hover:text-primary">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm">Photo</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-primary">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Location</span>
                </button>
              </div>
            </Card>

            {/* Posts */}
            {posts.map(post => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-xl">
                      {post.user.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{post.user.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{post.user.role}</span>
                        <span>•</span>
                        <span>{post.user.location}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <p className="mt-3 text-gray-700">{post.content}</p>

                {post.images.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {post.images.map((img, idx) => (
                      <div key={idx} className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                        {img}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      post.liked ? 'text-primary' : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary">
                    <Share2 className="w-4 h-4" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Farmers */}
            <Card>
              <h3 className="font-semibold mb-4">Suggested Farmers</h3>
              <div className="space-y-4">
                {suggestedFarmers.map(farmer => (
                  <div key={farmer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                        {farmer.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{farmer.name}</p>
                        <p className="text-xs text-gray-500">{farmer.location}</p>
                        <p className="text-xs text-gray-500">{farmer.crops.join(', ')}</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      <UserPlus className="w-3 h-3 mr-1" />
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-primary hover:underline w-full text-center">
                See more suggestions
              </button>
            </Card>

            {/* Popular Groups */}
            <Card>
              <h3 className="font-semibold mb-4">Popular Groups</h3>
              <div className="space-y-3">
                {groups.map(group => (
                  <div key={group.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {group.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-1">
                          {group.name}
                          {group.privacy === 'private' ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        </p>
                        <p className="text-xs text-gray-500">{group.members} members</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Join</Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trending Topics */}
            <Card>
              <h3 className="font-semibold mb-4">Trending Topics</h3>
              <div className="space-y-2">
                {['#OrganicFarming', '#SmartIrrigation', '#PestControl', '#CropRotation'].map(topic => (
                  <button key={topic} className="block text-sm text-primary hover:underline">
                    {topic}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <Card key={group.id} hover>
              <div className="text-center">
                <div className="text-5xl mb-3">{group.icon}</div>
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-1">
                  <UsersIcon className="w-4 h-4" />
                  <span>{group.members} members</span>
                  <span>•</span>
                  <span>{group.posts} posts/day</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1">Join Group</Button>
                  <Button variant="secondary" size="sm" className="flex-1">View</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Create Post</h3>
                <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your farming experience, tips, or questions..."
                className="input-field min-h-[150px] resize-none"
              />
              
              <div className="flex gap-2 mt-3">
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Add Photo
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Add Location
                </button>
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button variant="primary" className="flex-1" onClick={handlePost}>
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
                <Button variant="secondary" onClick={() => setShowPostModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}