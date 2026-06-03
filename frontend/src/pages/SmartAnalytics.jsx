import { useState } from 'react'
import { 
  TrendingUp, TrendingDown, BarChart3, LineChart as LineChartIcon,
  PieChart, Calendar, Download, Filter, Eye, Activity,
  ArrowUp, ArrowDown, DollarSign, Droplet, Sprout, Users
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, 
         PieChart as RePieChart, Pie, Cell, XAxis, YAxis, 
         CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function SmartAnalytics() {
  const [timeRange, setTimeRange] = useState('month')
  const [metric, setMetric] = useState('yield')

  const yieldData = [
    { month: 'Jan', yield: 2.4, target: 2.5, lastYear: 2.1 },
    { month: 'Feb', yield: 2.6, target: 2.5, lastYear: 2.3 },
    { month: 'Mar', yield: 2.8, target: 2.7, lastYear: 2.4 },
    { month: 'Apr', yield: 3.0, target: 2.8, lastYear: 2.6 },
    { month: 'May', yield: 3.2, target: 3.0, lastYear: 2.8 },
    { month: 'Jun', yield: 3.1, target: 3.0, lastYear: 2.7 },
  ]

  const waterUsageData = [
    { day: 'Mon', usage: 2450, optimal: 2200 },
    { day: 'Tue', usage: 2380, optimal: 2200 },
    { day: 'Wed', usage: 2520, optimal: 2200 },
    { day: 'Thu', usage: 2280, optimal: 2200 },
    { day: 'Fri', usage: 2350, optimal: 2200 },
    { day: 'Sat', usage: 2180, optimal: 2200 },
    { day: 'Sun', usage: 2050, optimal: 2000 },
  ]

  const cropDistribution = [
    { name: 'Rice', value: 45, color: '#2e7d32' },
    { name: 'Wheat', value: 30, color: '#ff9800' },
    { name: 'Maize', value: 15, color: '#2196f3' },
    { name: 'Others', value: 10, color: '#9c27b0' },
  ]

  const kpis = [
    { label: 'Average Yield', value: '3.2', unit: 'tons/acre', change: '+12%', trend: 'up', icon: Sprout },
    { label: 'Water Efficiency', value: '78', unit: '%', change: '+8%', trend: 'up', icon: Droplet },
    { label: 'Cost Savings', value: '₹12,450', unit: '', change: '+15%', trend: 'up', icon: DollarSign },
    { label: 'Farmers Reached', value: '1,234', unit: '', change: '+23%', trend: 'up', icon: Users },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Analytics</h1>
          <p className="text-gray-600 mt-1">Data-driven insights for better farming decisions</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {['week', 'month', 'year'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range ? 'bg-white shadow text-primary' : 'text-gray-600'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Card key={idx}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{kpi.label}</p>
                <p className="text-2xl font-bold mt-1">
                  {kpi.value}<span className="text-sm ml-1">{kpi.unit}</span>
                </p>
                <div className={`flex items-center gap-1 text-xs mt-1 ${
                  kpi.trend === 'up' ? 'text-success' : 'text-danger'
                }`}>
                  {kpi.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 rounded-full">
                <kpi.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Analysis */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Yield Analysis</h3>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <LineChartIcon className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="yield" stroke="#2e7d32" strokeWidth={2} name="Current Yield" />
              <Line type="monotone" dataKey="target" stroke="#ff9800" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              <Line type="monotone" dataKey="lastYear" stroke="#9e9e9e" strokeWidth={2} name="Last Year" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Water Usage */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Water Usage Optimization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={waterUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="usage" stackId="1" stroke="#2196f3" fill="#2196f3" fillOpacity={0.3} name="Actual Usage" />
              <Area type="monotone" dataKey="optimal" stackId="2" stroke="#4caf50" fill="#4caf50" fillOpacity={0.2} name="Optimal Usage" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Crop Distribution */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={cropDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {cropDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </Card>

        {/* Cost Analysis */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Input Cost</span>
                <span className="text-sm font-medium">₹8,500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 rounded-full h-2" style={{ width: '35%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Labor Cost</span>
                <span className="text-sm font-medium">₹12,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 rounded-full h-2" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Equipment</span>
                <span className="text-sm font-medium">₹5,500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 rounded-full h-2" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">AI Insight</h4>
              <p className="text-sm text-blue-800 mt-2">Based on current soil moisture, irrigation can be reduced by 15% this week.</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-green-900">Yield Prediction</h4>
              <p className="text-sm text-green-800 mt-2">Expected yield increase of 12% with current weather conditions.</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-orange-900">Alert</h4>
              <p className="text-sm text-orange-800 mt-2">Pest risk moderate in North Field. Check crop advisory.</p>
            </div>
            <Eye className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>
    </div>
  )
}