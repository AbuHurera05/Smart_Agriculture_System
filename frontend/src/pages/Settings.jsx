import { useState } from 'react'
import { Sun, Moon, Bell, Thermometer, Globe, ShieldAlert, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useStore from '../store/useStore'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full relative transition-colors duration-200 shrink-0 ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-white/15'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

export default function Settings() {
  const { darkMode, toggleDarkMode } = useStore()
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    pushAlerts: true,
    sensorAlerts: true,
    weeklyReport: false,
  })
  const [units, setUnits] = useState('metric')
  const [language, setLanguage] = useState('en')

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const savePreferences = () => {
    toast.success('Settings saved')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">Manage your app preferences and account options</p>
      </div>

      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          {darkMode ? <Moon size={17} /> : <Sun size={17} />} Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Dark Mode</p>
            <p className="text-xs text-gray-400">Switch between light and dark themes</p>
          </div>
          <Toggle checked={darkMode} onChange={toggleDarkMode} />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell size={17} /> Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive irrigation & alert emails' },
            { key: 'pushAlerts', label: 'Push Notifications', desc: 'In-app notification badge & sound' },
            { key: 'sensorAlerts', label: 'Sensor Threshold Alerts', desc: 'Notify when a reading leaves the safe range' },
            { key: 'weeklyReport', label: 'Weekly Summary Report', desc: 'Email digest every Monday' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <Toggle checked={prefs[item.key]} onChange={() => togglePref(item.key)} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Thermometer size={17} /> Units</h3>
        <div className="flex gap-2">
          {['metric', 'imperial'].map((u) => (
            <button
              key={u}
              onClick={() => setUnits(u)}
              className={`px-4 py-2 rounded-xl text-sm border transition-colors capitalize ${
                units === u ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-white/10 hover:border-primary'
              }`}
            >
              {u === 'metric' ? 'Metric (°C, mm)' : 'Imperial (°F, in)'}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Globe size={17} /> Language</h3>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
          <option value="ur">اردو (Urdu)</option>
        </select>
      </Card>

      <div className="flex justify-end">
        <Button onClick={savePreferences}>Save Preferences</Button>
      </div>

      <Card className="border-danger/30">
        <h3 className="font-semibold mb-2 flex items-center gap-2 text-danger"><ShieldAlert size={17} /> Danger Zone</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Deleting your account will remove all farm data, sensor history and preferences.</p>
        <Button variant="danger" size="sm" onClick={() => toast.error('Account deletion is disabled in this demo')}>
          <Trash2 size={14} /> Delete Account
        </Button>
      </Card>
    </div>
  )
}
