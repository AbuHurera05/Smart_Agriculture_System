import { useState } from 'react'
import { X, Send, Cpu, MapPin, Sprout, Droplets, Zap, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../common/Button'
import { iotAPI } from '../../services/api'
import { useAuthContext } from '../../context/AuthContext'

export default function RequestSetupModal({ open, onClose, onSuccess }) {
  const { user } = useAuthContext()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    farmName: '',
    farmLocation: '',
    farmSize: '5 Acres',
    cropType: 'Wheat',
    waterSource: 'Tube well (Groundwater)',
    pumpType: 'AC Electric Submersible',
    phoneNumber: user?.phoneNumber || user?.phone || '',
    notes: '',
  })

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await iotAPI.requestNewSetup({
        ...form,
        phoneNumber: form.phoneNumber || user?.email,
      })
      toast.success(res.data?.message || 'Application submitted successfully! Our team will contact you.')
      onSuccess?.(res.data?.data)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Request New IoT Setup"
        className="animate-scale-in flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-pop sm:rounded-2xl dark:bg-night-raised"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10 bg-emerald-50/50 dark:bg-emerald-500/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Apply for IoT Sensor Setup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                نیا اسمارٹ سنسر سیٹ اپ لگوانے کی درخواست
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto px-5 py-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/10">
            Once submitted, the AsanKisan administration will review your farm details, prepare an <strong>ESP32 automated kit</strong> (Soil Moisture, DHT22, Raindrop, Water Level &amp; Relay), and allocate it to your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Farm / Land Name (کھیت یا زمین کا نام) <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.farmName}
                onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                className="input-field"
                placeholder="e.g. Green Valley Farm - Field 1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Farm Location / District (علاقہ / شہر) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    required
                    value={form.farmLocation}
                    onChange={(e) => setForm({ ...form, farmLocation: e.target.value })}
                    className="input-field pl-8"
                    placeholder="e.g. Tando Jam, Sindh"
                  />
                  <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Land Size (زمین کا رقبہ)
                </label>
                <input
                  value={form.farmSize}
                  onChange={(e) => setForm({ ...form, farmSize: e.target.value })}
                  className="input-field"
                  placeholder="e.g. 5 Acres / 10 Jareeb"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Crop Type (فصل کی قسم)
                </label>
                <select
                  value={form.cropType}
                  onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                  className="input-field"
                >
                  <option>Wheat (گندم)</option>
                  <option>Rice (چاول)</option>
                  <option>Cotton (کپاس)</option>
                  <option>Sugarcane (کماد)</option>
                  <option>Maize (مکئی)</option>
                  <option>Tomato / Vegetables (ٹماٹر و سبزی)</option>
                  <option>Citrus / Mango Orchards (باغات)</option>
                  <option>Fodder / Grass (چارہ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Water Source (پانی کا ذریعہ)
                </label>
                <select
                  value={form.waterSource}
                  onChange={(e) => setForm({ ...form, waterSource: e.target.value })}
                  className="input-field"
                >
                  <option>Tube well (Groundwater)</option>
                  <option>Canal (Nehari Pani)</option>
                  <option>Storage Pond / Tank</option>
                  <option>River / Stream</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Pump Type (موٹر کی قسم)
                </label>
                <select
                  value={form.pumpType}
                  onChange={(e) => setForm({ ...form, pumpType: e.target.value })}
                  className="input-field"
                >
                  <option>AC Electric Submersible</option>
                  <option>Solar DC Pump</option>
                  <option>Monoblock Centrifugal</option>
                  <option>Diesel Generator Pump</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Contact Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    required
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    className="input-field pl-8"
                    placeholder="+92 300 1234567"
                  />
                  <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Special Requirements or Notes (اضافی تفصیل)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="input-field resize-none text-xs"
                placeholder="e.g. Need auto-shutoff when rain detected; sandy soil requires frequent small irrigations."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting} leftIcon={<Send className="h-4 w-4" />}>
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
