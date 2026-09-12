// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Sprout, Mail, Lock, Eye, EyeOff, User, Phone, MapPin } from 'lucide-react'
// import { useAuthContext } from '../context/AuthContext'
// import Button from '../components/common/Button'
// import toast from 'react-hot-toast'
// import { API_ROOT_URL, oauthProviders } from '../utils/constants'


// const startOAuthLogin = (providerId) => {
//   window.location.href = `${API_ROOT_URL}/oauth2/authorization/${providerId}`
// }

// const providerIcon = {
//   google: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24">
//       <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"/>
//       <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.31 24 12 24z"/>
//       <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28V6.61H1.27A11.97 11.97 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11z"/>
//       <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"/>
//     </svg>
//   ),
//   facebook: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
//       <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/>
//     </svg>
//   ),
// }

// export default function Login() {
//   const navigate = useNavigate()
//   const { login, register, loading } = useAuthContext()
//   const [isLogin, setIsLogin] = useState(true)
//   const [showPassword, setShowPassword] = useState(false)
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     phone: '',
//     location: '',
//     farmSize: ''
//   })

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     if (isLogin) {
//       const result = await login(formData.email, formData.password)
//       if (result.success) {
//         navigate('/dashboard')
//       }
//     } else {
//       if (!formData.name || !formData.email || !formData.password) {
//         toast.error('Please fill all required fields')
//         return
//       }
//       const result = await register(formData)
//       if (result.success) {
//         setIsLogin(true)
//         setFormData({
//           email: '',
//           password: '',
//           name: '',
//           phone: '',
//           location: '',
//           farmSize: ''
//         })
//       }
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-secondary-dark p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
//             <Sprout className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">AgroBazaar</h1>
//           <p className="text-xs font-medium text-primary tracking-wide uppercase mt-0.5">Smart Agriculture & Marketplace</p>
//           <p className="text-gray-600 mt-2">
//             {isLogin ? 'Sign in to your account' : 'Create a new account'}
//           </p>
//         </div>

//         <div className="space-y-3 mb-6">
//           {oauthProviders.map((provider) => (
//             <button
//               key={provider.id}
//               type="button"
//               onClick={() => startOAuthLogin(provider.id)}
//               className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
//             >
//               {providerIcon[provider.id]}
//               Continue with {provider.name}
//             </button>
//           ))}
//         </div>

//         <div className="flex items-center gap-3 mb-6">
//           <div className="flex-1 h-px bg-gray-200" />
//           <span className="text-xs text-gray-400 uppercase tracking-wide">or use your email</span>
//           <div className="flex-1 h-px bg-gray-200" />
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!isLogin && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name *
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     className="input-field pl-10"
//                     placeholder="John Farmer"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone Number
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                     className="input-field pl-10"
//                     placeholder="+91 98765 43210"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Location
//                 </label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     value={formData.location}
//                     onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                     className="input-field pl-10"
//                     placeholder="City, State"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Farm Size (acres)
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.farmSize}
//                   onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
//                   className="input-field"
//                   placeholder="e.g., 15 acres"
//                 />
//               </div>
//             </>
//           )}
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address *
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 className="input-field pl-10"
//                 placeholder="farmer@example.com"
//                 required
//               />
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password *
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 className="input-field pl-10 pr-10"
//                 placeholder="••••••••"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2"
//               >
//                 {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
//               </button>
//             </div>
//           </div>
          
//           {isLogin && (
//             <div className="flex items-center justify-between">
//               <label className="flex items-center">
//                 <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
//                 <span className="ml-2 text-sm text-gray-600">Remember me</span>
//               </label>
//               <a href="#" className="text-sm text-primary hover:underline">
//                 Forgot password?
//               </a>
//             </div>
//           )}
          
//           <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
//             {isLogin ? 'Sign In' : 'Create Account'}
//           </Button>
//         </form>
        
//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             {isLogin ? "Don't have an account? " : "Already have an account? "}
//             <button
//               onClick={() => {
//                 setIsLogin(!isLogin)
//                 setFormData({
//                   email: '',
//                   password: '',
//                   name: '',
//                   phone: '',
//                   location: '',
//                   farmSize: ''
//                 })
//               }}
//               className="text-primary hover:underline font-medium"
//             >
//               {isLogin ? 'Sign up' : 'Sign in'}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

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

// const startGoogleLogin = () => {
//   window.location.href = `${API_ROOT_URL}/oauth2/authorization/google`
// }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="grid min-h-[680px] lg:grid-cols-2">

            {/* =========================================================
                LEFT BRANDING PANEL
            ========================================================= */}
            <div className="relative hidden overflow-hidden bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">

              {/* Decorative circles */}
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
              <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10" />

              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                    <Sprout className="h-7 w-7" />
                  </div>

                  <div>
                    <h1 className="text-xl font-bold tracking-tight">
                      AgroBazaar
                    </h1>
                    <p className="text-xs text-green-100">
                      Smart Agriculture Platform
                    </p>
                  </div>
                </div>

                <div className="max-w-md">
                  <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                    <Leaf className="h-4 w-4" />
                    Grow • Connect • Trade
                  </p>

                  <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
                    Smarter farming.
                    <br />
                    Better opportunities.
                  </h2>

                  <p className="mt-6 max-w-lg text-base leading-7 text-green-50/90">
                    Connect with agricultural experts, discover farming
                    solutions, and access a smarter marketplace built for
                    the modern agriculture community.
                  </p>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Secure Authentication
                    </p>
                    <p className="text-xs text-green-100/80">
                      Protected with modern authentication
                    </p>
                  </div>
                </div>

                <p className="text-xs text-green-100/70">
                  © {new Date().getFullYear()} AgroBazaar. Smart Agriculture
                  & Marketplace.
                </p>
              </div>
            </div>

            {/* =========================================================
                RIGHT AUTH PANEL
            ========================================================= */}
            <div className="flex items-center justify-center p-6 sm:p-10">
              <div className="w-full max-w-md">

                {/* Mobile Logo */}
                <div className="mb-8 flex items-center justify-center lg:hidden">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 shadow-lg shadow-green-600/20">
                      <Sprout className="h-7 w-7 text-white" />
                    </div>

                    <div>
                      <h1 className="text-xl font-bold text-gray-900">
                        AgroBazaar
                      </h1>
                      <p className="text-xs font-medium uppercase tracking-wide text-green-600">
                        Smart Agriculture
                      </p>
                    </div>
                  </div>
                </div>

                {/* Header */}
                <div className="mb-7">
                  <p className="mb-2 text-sm font-semibold text-green-600">
                    Welcome {isLogin ? 'back' : 'to AgroBazaar'} 👋
                  </p>

                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    {isLogin ? 'Sign in to your account' : 'Create your account'}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {isLogin
                      ? 'Access your agriculture dashboard and marketplace.'
                      : 'Join AgroBazaar and start your smart agriculture journey.'}
                  </p>
                </div>

                {/* =====================================================
                    GOOGLE OAUTH
                ===================================================== */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || oauthLoading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {oauthLoading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
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
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-200" />

                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    or continue with email
                  </span>

                  <div className="h-px flex-1 bg-gray-200" />
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
                          className="mb-1.5 block text-sm font-semibold text-gray-700"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                          <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                          <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              updateField('name', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
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
                          className="mb-1.5 block text-sm font-semibold text-gray-700"
                        >
                          Phone Number
                        </label>

                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                          <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              updateField('phone', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                            placeholder="+92 300 1234567"
                            autoComplete="tel"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label
                          htmlFor="location"
                          className="mb-1.5 block text-sm font-semibold text-gray-700"
                        >
                          Location
                        </label>

                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                          <input
                            id="location"
                            type="text"
                            value={formData.location}
                            onChange={(e) =>
                              updateField('location', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                            placeholder="City, Province"
                            autoComplete="address-level2"
                          />
                        </div>
                      </div>

                      {/* Farm Size */}
                      <div>
                        <label
                          htmlFor="farmSize"
                          className="mb-1.5 block text-sm font-semibold text-gray-700"
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
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                          placeholder="e.g. 15 acres"
                        />
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-semibold text-gray-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          updateField('email', e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
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
                      className="mb-1.5 block text-sm font-semibold text-gray-700"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) =>
                          updateField('password', e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                        placeholder="Enter your password"
                        autoComplete={
                          isLogin ? 'current-password' : 'new-password'
                        }
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((previous) => !previous)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-700"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Login Options */}
                  {isLogin && (
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />

                        <span className="text-sm text-gray-600">
                          Remember me
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          toast('Password recovery will be available soon.')
                        }
                        className="text-sm font-semibold text-green-600 transition-colors hover:text-green-700"
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
                      className="w-full !rounded-xl"
                      loading={loading}
                      disabled={oauthLoading}
                    >
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                  </div>
                </form>

                {/* Switch Login/Register */}
                <div className="mt-7 text-center">
                  <p className="text-sm text-gray-500">
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
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Your account is protected by secure authentication</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
