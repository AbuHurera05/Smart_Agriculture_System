import { useState } from 'react'
import { X, GraduationCap } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../common/Button'

export default function ApplyExpertModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ specialization: '', experience: '', motivation: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.specialization.trim()) {
      toast.error('Please enter your area of specialization')
      return
    }
    if (!form.experience.trim()) {
      toast.error('Please enter your years of experience')
      return
    }
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><GraduationCap size={20} /></div>
            <h2 className="font-semibold text-lg">Apply to Become an Expert</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-gray-500">
            Share your agricultural expertise with the community by hosting training sessions and
            workshops. Your application will be reviewed by an admin before your account is
            upgraded to an Expert account.
          </p>

          <div>
            <label className="text-sm font-medium text-gray-700">Area of Specialization</label>
            <input
              className="input-field mt-1"
              placeholder="e.g. Soil Science, Crop Disease, Irrigation"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              className="input-field mt-1"
              placeholder="e.g. 6 years"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Why do you want to become an expert?</label>
            <textarea
              className="input-field mt-1"
              rows={3}
              placeholder="Tell us about your background and what you'd like to teach..."
              value={form.motivation}
              onChange={(e) => setForm({ ...form, motivation: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Not now</Button>
            <Button type="submit" variant="primary">Submit Application</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
