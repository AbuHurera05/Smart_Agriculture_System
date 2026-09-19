import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sprout,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Cpu,
  Store,
  LineChart,
} from 'lucide-react'
import { useAuthContext } from '../context/AuthContext'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'
import { API_ROOT_URL } from '../utils/constants'

/*
|--------------------------------------------------------------------------
| Google OAuth2
|--------------------------------------------------------------------------
| Spring Boot:
|   server.port=8081
|   server.servlet.context-path=/api
|
| Therefore:
|   http://localhost:8081/api/oauth2/authorization/google
|
| API_ROOT_URL should normally be:
|   http://localhost:8081/api
|
| Spring Security handles the Google OAuth flow.
| Do NOT manually get/store Google's access token here.
|--------------------------------------------------------------------------
*/

const startGoogleLogin = () => {
  window.location.href = `${API_ROOT_URL}/api/oauth2/authorization/google`
}

const initialFormData = {
  email: '',
  password: '',
  name: '',
  phone: '',
  location: '',
  farmSize: '',
}

export default function Login() {
  const navigate = useNavigate()
  const { login, register, loading } = useAuthContext()

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormData)

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleGoogleLogin = () => {
    try {
      setOauthLoading(true)
      startGoogleLogin()
    } catch (error) {
      console.error('Google OAuth error:', error)
      setOauthLoading(false)
      toast.error('Unable to start Google login')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = formData.email.trim()
    const password = formData.password

    if (!email || !password) {
      toast.error('Please enter your email and password')
      return
    }

    try {
      if (isLogin) {
        const result = await login(email, password)

        if (result?.success) {
          navigate('/dashboard')
        }
      } else {
        if (!formData.name.trim()) {
          toast.error('Please enter your full name')
          return
        }

        const result = await register({
          ...formData,
          name: formData.name.trim(),
          email,
        })

        if (result?.success) {
          setIsLogin(true)
          setFormData(initialFormData)

          toast.success('Account created successfully. Please sign in.')
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  const switchMode = () => {
    setIsLogin((previous) => !previous)
    setFormData(initialFormData)
    setShowPassword(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-100/50 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_70px_-20px_rgba(16,185,129,0.25)] ring-1 ring-slate-900/5">
            <div className="grid min-h-[720px] lg:grid-cols-2">

              {/* =========================================================
                  LEFT BRANDING PANEL
              ========================================================= */}
              <div className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-700 via-green-700 to-teal-800 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">

                {/* Grid pattern overlay */}
                <div
                  className="absolute inset-0 opacity-[0.15]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Decorative blobs */}
                <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

                <div className="relative z-10">
                  {/* Logo */}
                  <div className="mb-10 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
                      <Sprout className="h-7 w-7" />
                    </div>

                    <div>
                      <h1 className="text-xl font-bold tracking-tight">
                        AgroBazaar
                      </h1>
                      <p className="text-xs font-medium text-green-100/80">
                        IoT-Based Smart Agriculture System
                      </p>
                    </div>
                  </div>

                  {/* Hero content */}
                  <div className="max-w-md">
                    <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/15 backdrop-blur">
                      <Leaf className="h-3.5 w-3.5" />
                      Monitor • Automate • Trade
                    </p>

                    <h2 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
                      Smart farming.
                      <br />
                      <span className="bg-gradient-to-r from-lime-200 to-emerald-200 bg-clip-text text-transparent">
                        Powered by IoT.
                      </span>
                    </h2>

                    <p className="mt-6 max-w-lg text-[15px] leading-7 text-green-50/85">
                      Monitor your farm in real-time with IoT sensors,
                      automate irrigation and crop management, and connect
                      directly with buyers through our integrated
                      agriculture marketplace.
                    </p>
                  </div>
                </div>

                {/* Bottom features */}
                <div className="relative z-10 space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                        <Cpu className="h-4.5 w-4.5 text-lime-200" />
                      </div>
                      <p className="text-sm text-green-50/90">
                        Real-time IoT sensor monitoring
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                        <Store className="h-4.5 w-4.5 text-lime-200" />
                      </div>
                      <p className="text-sm text-green-50/90">
                        Integrated farmer-to-buyer marketplace
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                        <LineChart className="h-4.5 w-4.5 text-lime-200" />
                      </div>
                      <p className="text-sm text-green-50/90">
                        Smart analytics from live farm data
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-5">
                    <p className="text-xs text-green-100/60">
                      © {new Date().getFullYear()} AgroBazaar. IoT Smart
                      Agriculture & Marketplace.
                    </p>
                  </div>
                </div>
              </div>

              {/* =========================================================
                  RIGHT AUTH PANEL
              ========================================================= */}
              <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
                <div className="w-full max-w-md">

                  {/* Mobile Logo */}
                  <div className="mb-8 flex items-center justify-center lg:hidden">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-600/25">
                        <Sprout className="h-7 w-7 text-white" />
                      </div>

                      <div>
                        <h1 className="text-xl font-bold text-slate-900">
                          AgroBazaar
                        </h1>
                        <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                          IoT Smart Farming
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mode Toggle */}
                  <div className="mb-7 flex rounded-2xl bg-slate-100 p-1.5 ring-1 ring-slate-200/60">
                    <button
                      type="button"
                      onClick={() => !isLogin && switchMode()}
                      disabled={loading || oauthLoading}
                      className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        isLogin
                          ? 'bg-white text-green-700 shadow-sm ring-1 ring-slate-900/5'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Sign In
                    </button>

                    <button
                      type="button"
                      onClick={() => isLogin && switchMode()}
                      disabled={loading || oauthLoading}
                      className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        !isLogin
                          ? 'bg-white text-green-700 shadow-sm ring-1 ring-slate-900/5'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-[26px] font-bold leading-tight tracking-tight text-slate-900">
                      {isLogin ? 'Welcome back 👋' : 'Create your account'}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {isLogin
                        ? 'Sign in to access your IoT farm dashboard and marketplace.'
                        : 'Join AgroBazaar and start your smart farming journey today.'}
                    </p>
                  </div>

                  {/* =====================================================
                      GOOGLE OAUTH
                  ===================================================== */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading || oauthLoading}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {oauthLoading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-green-600" />
                    ) : (
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill="#4285F4"
                          d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.31 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28V6.61H1.27A11.97 11.97 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4 3.11z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.61l4 3.11 4-3.11C8.87 4.75 12 4.75z"
                        />
                      </svg>
                    )}

                    <span>
                      {oauthLoading
                        ? 'Connecting to Google...'
                        : 'Continue with Google'}
                    </span>

                    {!oauthLoading && (
                      <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    )}
                  </button>

                  {/* Divider */}
                  <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200" />

                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      or continue with email
                    </span>

                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  {/* =====================================================
                      EMAIL/PASSWORD FORM
                  ===================================================== */}
                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Registration Fields */}
                    {!isLogin && (
                      <>
                        {/* Name */}
                        <div>
                          <label
                            htmlFor="name"
                            className="mb-1.5 block text-[13px] font-semibold text-slate-700"
                          >
                            Full Name <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <User className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                            <input
                              id="name"
                              type="text"
                              value={formData.name}
                              onChange={(e) =>
                                updateField('name', e.target.value)
                              }
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                              placeholder="Enter your full name"
                              autoComplete="name"
                              required
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label
                            htmlFor="phone"
                            className="mb-1.5 block text-[13px] font-semibold text-slate-700"
                          >
                            Phone Number
                          </label>

                          <div className="relative">
                            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                            <input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                updateField('phone', e.target.value)
                              }
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                              placeholder="+92 300 1234567"
                              autoComplete="tel"
                            />
                          </div>
                        </div>

                        {/* Location + Farm Size (2-column) */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Location */}
                          <div>
                            <label
                              htmlFor="location"
                              className="mb-1.5 block text-[13px] font-semibold text-slate-700"
                            >
                              Location
                            </label>

                            <div className="relative">
                              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                              <input
                                id="location"
                                type="text"
                                value={formData.location}
                                onChange={(e) =>
                                  updateField('location', e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                                placeholder="City, Province"
                                autoComplete="address-level2"
                              />
                            </div>
                          </div>

                          {/* Farm Size */}
                          <div>
                            <label
                              htmlFor="farmSize"
                              className="mb-1.5 block text-[13px] font-semibold text-slate-700"
                            >
                              Farm Size
                            </label>

                            <input
                              id="farmSize"
                              type="text"
                              value={formData.farmSize}
                              onChange={(e) =>
                                updateField('farmSize', e.target.value)
                              }
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                              placeholder="e.g. 15 acres"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-[13px] font-semibold text-slate-700"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            updateField('email', e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                          placeholder="you@example.com"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-1.5 block text-[13px] font-semibold text-slate-700"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) =>
                            updateField('password', e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                          placeholder={
                            isLogin
                              ? 'Enter your password'
                              : 'Create a strong password'
                          }
                          autoComplete={
                            isLogin ? 'current-password' : 'new-password'
                          }
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((previous) => !previous)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-[18px] w-[18px]" />
                          ) : (
                            <Eye className="h-[18px] w-[18px]" />
                          )}
                        </button>
                      </div>

                      {!isLogin && formData.password.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                formData.password.length < 6
                                  ? 'w-1/3 bg-red-500'
                                  : formData.password.length < 10
                                  ? 'w-2/3 bg-amber-500'
                                  : 'w-full bg-green-500'
                              }`}
                            />
                          </div>
                          <span
                            className={`text-[11px] font-semibold ${
                              formData.password.length < 6
                                ? 'text-red-500'
                                : formData.password.length < 10
                                ? 'text-amber-600'
                                : 'text-green-600'
                            }`}
                          >
                            {formData.password.length < 6
                              ? 'Weak'
                              : formData.password.length < 10
                              ? 'Good'
                              : 'Strong'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Login Options */}
                    {isLogin && (
                      <div className="flex items-center justify-between pt-1">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-green-600 transition focus:ring-2 focus:ring-green-500/30"
                          />

                          <span className="text-[13px] font-medium text-slate-600">
                            Remember me
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            toast('Password recovery will be available soon.')
                          }
                          className="text-[13px] font-semibold text-green-600 transition-colors hover:text-green-700"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Submit */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full !rounded-xl !py-3.5 !text-[15px] !font-semibold !shadow-lg !shadow-green-600/20 !transition-all hover:!shadow-xl hover:!shadow-green-600/30"
                        loading={loading}
                        disabled={oauthLoading}
                      >
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </Button>
                    </div>
                  </form>

                  {/* Switch Login/Register */}
                  <div className="mt-7 text-center">
                    <p className="text-[13px] text-slate-500">
                      {isLogin
                        ? "Don't have an account? "
                        : 'Already have an account? '}

                      <button
                        type="button"
                        onClick={switchMode}
                        disabled={loading || oauthLoading}
                        className="font-semibold text-green-600 transition-colors hover:text-green-700 disabled:opacity-50"
                      >
                        {isLogin ? 'Create one' : 'Sign in'}
                      </button>
                    </p>
                  </div>

                  {/* Security Note */}
                  <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/60">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span className="text-[11px] font-medium text-slate-500">
                      Your account is protected by secure authentication
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Bottom footer */}
          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to AgroBazaar's Terms of Service &
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}