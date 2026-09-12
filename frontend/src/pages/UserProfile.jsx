import { useRef, useState } from 'react'
import { Camera, Mail, Phone, MapPin, Sprout, Save, Lock, Eye, EyeOff, BadgeCheck, GraduationCap, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import ApplyExpertModal from '../components/experts/ApplyExpertModal'
import { useAuthContext } from '../context/AuthContext'

export default function UserProfile() {
  const { user, updateUser, isFarmer, applyForExpert, expertRequestStatus } = useAuthContext()
  const fileInputRef = useRef(null)
  const [showExpertModal, setShowExpertModal] = useState(false)

  const handleApplyExpert = async (data) => {
    const res = await applyForExpert(data)
    if (res.success) setShowExpertModal(false)
  }

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    farmSize: user?.farmSize || '',
  })

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    const reader = new FileReader()
    reader.onload = async () => {
      await updateUser({ avatarImage: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required')
      return
    }
    setSavingProfile(true)
    try {
      await updateUser(form)
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (!passwordForm.current || !passwordForm.next) {
      toast.error('Please fill in all password fields')
      return
    }
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.next.length < 6) {
      toast.error('Password should be at least 6 characters')
      return
    }
    setSavingPassword(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      toast.success('Password updated successfully')
      setPasswordForm({ current: '', next: '', confirm: '' })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">View and manage your account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary card */}
        <Card className="lg:col-span-1 text-center">
          <div className="relative w-24 h-24 mx-auto">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-3xl overflow-hidden">
              {user?.avatarImage ? (
                <img src={user.avatarImage} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{user?.avatar || '🧑‍🌾'}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary-dark transition-colors"
              title="Change profile picture"
            >
              <Camera size={14} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <h2 className="mt-4 font-semibold text-lg">{user?.name}</h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <div className="mt-2 flex justify-center">
            <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : user?.role === 'expert' ? 'badge-info' : 'badge-success'} inline-flex items-center gap-1`}>
              <BadgeCheck size={12} />
              {user?.role === 'admin' ? 'Administrator' : user?.role === 'expert' ? 'Agricultural Expert' : 'Verified Farmer'}
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-left text-sm">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
              <p className="text-gray-400 text-xs">Joined</p>
              <p className="font-medium">{user?.joinDate || '—'}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
              <p className="text-gray-400 text-xs">Farm Size</p>
              <p className="font-medium">{user?.farmSize || '—'}</p>
            </div>
          </div>

          {isFarmer && (
            <div className="mt-6 pt-6 border-t text-left">
              {expertRequestStatus === 'pending' ? (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-50 text-yellow-800">
                  <Clock size={16} className="shrink-0 mt-0.5" />
                  <p className="text-sm">Your expert application is pending admin approval.</p>
                </div>
              ) : expertRequestStatus === 'rejected' ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700">
                    <p className="text-sm">Your previous expert application was not approved.</p>
                  </div>
                  <Button variant="secondary" className="w-full" onClick={() => setShowExpertModal(true)}>
                    <GraduationCap size={16} /> Re-apply as an Expert
                  </Button>
                </div>
              ) : (
                <Button variant="secondary" className="w-full" onClick={() => setShowExpertModal(true)}>
                  <GraduationCap size={16} /> Apply to Become an Expert
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Edit forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-semibold mb-4">Profile Information</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Full Name <span className="text-danger">*</span></label>
                  <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required disabled={savingProfile} />
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block flex items-center gap-1"><Mail size={13} /> Email <span className="text-danger">*</span></label>
                  <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required disabled={savingProfile} />
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block flex items-center gap-1"><Phone size={13} /> Phone</label>
                  <input className="input-field" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={savingProfile} />
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block flex items-center gap-1"><MapPin size={13} /> Location</label>
                  <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} disabled={savingProfile} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block flex items-center gap-1"><Sprout size={13} /> Farm Size</label>
                  <input className="input-field" value={form.farmSize} onChange={(e) => setForm({ ...form, farmSize: e.target.value })} disabled={savingProfile} />
                </div>
              </div>
              <Button type="submit" loading={savingProfile}>
                <Save size={16} /> Save Changes
              </Button>
            </form>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Lock size={16} /> Change Password</h3>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Current Password <span className="text-danger">*</span></label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  required
                  disabled={savingPassword}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">New Password <span className="text-danger">*</span></label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    value={passwordForm.next}
                    onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                    required
                    minLength={6}
                    disabled={savingPassword}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Confirm New Password <span className="text-danger">*</span></label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    required
                    minLength={6}
                    disabled={savingPassword}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer w-fit">
                <input type="checkbox" checked={showPassword} onChange={() => setShowPassword((v) => !v)} disabled={savingPassword} />
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />} Show passwords
              </label>
              <Button type="submit" variant="secondary" loading={savingPassword}>Update Password</Button>
            </form>
          </Card>
        </div>
      </div>

      {showExpertModal && (
        <ApplyExpertModal onClose={() => setShowExpertModal(false)} onSubmit={handleApplyExpert} />
      )}
    </div>
  )
}
