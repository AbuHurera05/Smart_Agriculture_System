import { useState } from 'react'
import { Smartphone, Download, QrCode, Apple, Smartphone as Android, CheckCircle } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function MobileAppView() {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://smartagri.app/download')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mobile App</h1>
        <p className="text-gray-600 mt-1">Manage your farm from anywhere with our mobile app</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* App Preview */}
        <Card className="bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="text-center">
            <Smartphone className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Smart Agriculture App</h2>
            <p className="opacity-90">Monitor your farm, control irrigation, and get AI-powered insights on the go</p>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span>Real-time sensor monitoring</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span>Remote irrigation control</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span>AI crop advisory</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span>Weather alerts and forecasts</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span>Community forum and expert chat</span>
            </div>
          </div>
        </Card>
        
        {/* Download Options */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Download App</h3>
            <div className="space-y-3">
              <Button variant="primary" size="lg" className="w-full justify-center">
                <Apple className="w-5 h-5 mr-2" />
                Download for iOS
              </Button>
              <Button variant="secondary" size="lg" className="w-full justify-center">
                <Android className="w-5 h-5 mr-2" />
                Download for Android
              </Button>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-100 rounded-xl mb-3">
                <QrCode className="w-32 h-32 text-gray-800" />
              </div>
              <p className="text-sm text-gray-500">Scan with your phone camera to download</p>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold mb-2">Or visit our website</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value="https://smartagri.app/download"
                readOnly
                className="input-field flex-1 text-sm"
              />
              <Button onClick={handleCopyLink} variant="secondary">
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Mobile Screenshots Preview */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">App Features Preview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Dashboard', 'Sensors', 'Irrigation', 'Crops'].map((feature, idx) => (
            <div key={idx} className="text-center">
              <div className="bg-gray-100 rounded-xl p-4 mb-2">
                <Smartphone className="w-12 h-12 mx-auto text-primary" />
              </div>
              <p className="text-sm font-medium">{feature}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}