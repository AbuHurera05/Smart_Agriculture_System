import { useState } from 'react'
import {
  Sun, Moon, Bell, Thermometer, Globe, ShieldAlert, Trash2, Save,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useStore from '../store/useStore'

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
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    pushAlerts: true,
    sensorAlerts: true,
    weeklyReport: false,
  })
  const [units, setUnits] = useState('metric')
  const [language, setLanguage] = useState('en')

  const togglePref = (key) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const savePreferences = () => {
    toast.success('Settings saved')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Manage your app preferences and account options
        </p>
      </div>

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

      {/* Notifications */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            <Bell size={16} />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Notifications
          </h3>
        </div>

        <div className="space-y-4">
          {[
            {
              key: 'emailAlerts',
              label: 'Email Alerts',
              desc: 'Receive irrigation & alert emails',
            },
            {
              key: 'pushAlerts',
              label: 'Push Notifications',
              desc: 'In-app notification badge & sound',
            },
            {
              key: 'sensorAlerts',
              label: 'Sensor Threshold Alerts',
              desc: 'Notify when a reading leaves the safe range',
            },
            {
              key: 'weeklyReport',
              label: 'Weekly Summary Report',
              desc: 'Email digest every Monday',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-white/5"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
              <Toggle
                checked={prefs[item.key]}
                onChange={() => togglePref(item.key)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Units */}
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
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                units === u
                  ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-600/25'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {u === 'metric' ? 'Metric (°C, mm)' : 'Imperial (°F, in)'}
            </button>
          ))}
        </div>
      </Card>

      {/* Language */}
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
          className="max-w-xs rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
          <option value="ur">اردو (Urdu)</option>
        </select>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={savePreferences}>
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-500/20">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <ShieldAlert size={16} />
          </div>
          <h3 className="text-base font-semibold text-red-600 dark:text-red-400">
            Danger Zone
          </h3>
        </div>

        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Deleting your account will remove all farm data, sensor history and
          preferences.
        </p>

        <Button
          variant="danger"
          size="sm"
          onClick={() =>
            toast.error('Account deletion is disabled in this demo')
          }
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </Card>
    </div>
  )
}