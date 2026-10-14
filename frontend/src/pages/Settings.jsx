import { useState, useEffect } from 'react'
import {
  Sun, Moon, Bell, Thermometer, Globe, ShieldAlert, Trash2, Save,
  Mail, Phone, MessageSquare, Send, CheckCircle2, Droplets, Waves,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useStore from '../store/useStore'
import { iotAPI } from '../services/api'

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 ${
        checked
          ? 'bg-green-600'
          : 'bg-slate-200 dark:bg-white/10'
      }`}
    >
      <span
        className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const { darkMode, toggleDarkMode } = useStore()

  // Notification configuration state
  const [email, setEmail] = useState('m01012002809234@gmail.com')
  const [phoneNumber, setPhoneNumber] = useState('+923001234567')
  const [whatsappNumber, setWhatsappNumber] = useState('+923001234567')

  const [channels, setChannels] = useState({
    emailEnabled: true,
    smsEnabled: true,
    whatsappEnabled: true,
    sensorAlertsEnabled: true,
    autoIrrigationEnabled: true,
  })

  // Irrigation & sensor thresholds
  const [thresholds, setThresholds] = useState({
    lowMoistureThreshold: 30,
    targetMoistureThreshold: 65,
    minWaterLevelThreshold: 15,
  })

  const [units, setUnits] = useState('metric')
  const [language, setLanguage] = useState('en')
  const [saving, setSaving] = useState(false)
  const [testingChannel, setTestingChannel] = useState(null)

  // 1. Fetch current settings from backend on mount
  useEffect(() => {
    iotAPI.getNotificationSettings()
      .then((res) => {
        if (res.data?.data) {
          const s = res.data.data
          if (s.email) setEmail(s.email)
          if (s.phoneNumber) setPhoneNumber(s.phoneNumber)
          if (s.whatsappNumber) setWhatsappNumber(s.whatsappNumber)
          setChannels({
            emailEnabled: s.emailEnabled ?? true,
            smsEnabled: s.smsEnabled ?? true,
            whatsappEnabled: s.whatsappEnabled ?? true,
            sensorAlertsEnabled: s.sensorAlertsEnabled ?? true,
            autoIrrigationEnabled: s.autoIrrigationEnabled ?? true,
          })
          setThresholds({
            lowMoistureThreshold: s.lowMoistureThreshold ?? 30,
            targetMoistureThreshold: s.targetMoistureThreshold ?? 65,
            minWaterLevelThreshold: s.minWaterLevelThreshold ?? 15,
          })
        }
      })
      .catch((err) => {
        console.warn('Could not load backend notification settings:', err.message)
      })
  }, [])

  const toggleChannel = (key) =>
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }))

  // 2. Save settings to backend
  const savePreferences = async () => {
    setSaving(true)
    try {
      const payload = {
        email,
        phoneNumber,
        whatsappNumber,
        ...channels,
        ...thresholds,
      }
      await iotAPI.updateNotificationSettings(payload)
      toast.success('Notification & system settings saved successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  // 3. Test alert dispatch (Gmail, SMS, WhatsApp)
  const handleTestAlert = async (channel) => {
    setTestingChannel(channel)
    try {
      const res = await iotAPI.sendTestNotification(channel)
      toast.success(res.data?.message || `Test ${channel} alert sent!`)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || `Failed to send ${channel} test alert`)
    } finally {
      setTestingChannel(null)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Settings &amp; Alert Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Configure Gmail, Mobile SMS, and WhatsApp alerts for your ESP32 farm sensors
        </p>
      </div>

      {/* Multi-Channel Alerts Card */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Multi-Channel Alert Delivery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Receive instant warnings on soil dryness, tank empty levels, and rainfall
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
            Live
          </span>
        </div>

        <div className="space-y-5">
          {/* Channel 1: Gmail (Email) */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Gmail / Email Alerts
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    HTML emails with sensor readings, pump status, and safety alerts
                  </p>
                </div>
              </div>
              <Toggle
                checked={channels.emailEnabled}
                onChange={() => toggleChannel('emailEnabled')}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 dark:border-white/10 dark:bg-night-raised dark:text-white"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleTestAlert('EMAIL')}
                disabled={testingChannel === 'EMAIL'}
                leftIcon={<Send size={13} className={testingChannel === 'EMAIL' ? 'animate-spin' : ''} />}
              >
                Test Gmail
              </Button>
            </div>
          </div>

          {/* Channel 2: Mobile Number (SMS) */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Mobile SMS Alerts
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Instant text message notifications to your cell phone
                  </p>
                </div>
              </div>
              <Toggle
                checked={channels.smsEnabled}
                onChange={() => toggleChannel('smsEnabled')}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+923001234567"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 dark:border-white/10 dark:bg-night-raised dark:text-white"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleTestAlert('SMS')}
                disabled={testingChannel === 'SMS'}
                leftIcon={<Send size={13} className={testingChannel === 'SMS' ? 'animate-spin' : ''} />}
              >
                Test SMS
              </Button>
            </div>
          </div>

          {/* Channel 3: WhatsApp */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    WhatsApp Alerts
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Formatted WhatsApp messages with emojis, sensor values, and actions
                  </p>
                </div>
              </div>
              <Toggle
                checked={channels.whatsappEnabled}
                onChange={() => toggleChannel('whatsappEnabled')}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+923001234567"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 dark:border-white/10 dark:bg-night-raised dark:text-white"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleTestAlert('WHATSAPP')}
                disabled={testingChannel === 'WHATSAPP'}
                leftIcon={<Send size={13} className={testingChannel === 'WHATSAPP' ? 'animate-spin' : ''} />}
              >
                Test WhatsApp
              </Button>
            </div>
          </div>

          {/* Automation & Sensor Toggles */}
          <div className="pt-2 space-y-3 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Smart Auto-Irrigation Motor Control
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Auto start pump when soil &lt; 30%, stop at 65%, cut off if rain or low water
                </p>
              </div>
              <Toggle
                checked={channels.autoIrrigationEnabled}
                onChange={() => toggleChannel('autoIrrigationEnabled')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Sensor Threshold Warnings
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Send notifications when DHT22 temperature exceeds 38°C or tank is empty
                </p>
              </div>
              <Toggle
                checked={channels.sensorAlertsEnabled}
                onChange={() => toggleChannel('sensorAlertsEnabled')}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Irrigation Thresholds Configuration */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300">
            <Droplets size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Automation Thresholds
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize trigger points for your soil moisture and water reservoir
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Dry Soil Trigger (%)
            </label>
            <input
              type="number"
              value={thresholds.lowMoistureThreshold}
              onChange={(e) => setThresholds({ ...thresholds, lowMoistureThreshold: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-green-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <span className="text-[11px] text-slate-400">Pump starts below this value</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Target Soil Moisture (%)
            </label>
            <input
              type="number"
              value={thresholds.targetMoistureThreshold}
              onChange={(e) => setThresholds({ ...thresholds, targetMoistureThreshold: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-green-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <span className="text-[11px] text-slate-400">Pump stops at this value</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Min Water Level Cutoff (%)
            </label>
            <input
              type="number"
              value={thresholds.minWaterLevelThreshold}
              onChange={(e) => setThresholds({ ...thresholds, minWaterLevelThreshold: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-green-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <span className="text-[11px] text-slate-400">Dry-run safety cutoff</span>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            {darkMode ? <Moon size={16} /> : <Sun size={16} />}
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Appearance
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Dark Mode
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Switch between light and dark themes
            </p>
          </div>
          <Toggle checked={darkMode} onChange={toggleDarkMode} />
        </div>
      </Card>

      {/* Units & Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
              <Thermometer size={16} />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Units
            </h3>
          </div>
          <div className="flex gap-2">
            {['metric', 'imperial'].map((u) => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                  units === u
                    ? 'border-green-500 bg-emerald-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'
                }`}
              >
                {u === 'metric' ? 'Metric (°C, %)' : 'Imperial (°F, %)'}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
              <Globe size={16} />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Language
            </h3>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm text-slate-900 outline-none transition-all dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <option value="en">English</option>
            <option value="ur">اردو (Urdu)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="primary"
          onClick={savePreferences}
          disabled={saving}
          leftIcon={<Save className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  )
}