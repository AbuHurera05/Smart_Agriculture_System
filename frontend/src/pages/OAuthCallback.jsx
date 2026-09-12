import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useAuthContext } from '../context/AuthContext'

// Route: /oauth2/redirect
// The backend's OAuth2 success handler should redirect the browser here
// after Google/Facebook login completes, e.g.:
//   https://your-frontend.app/oauth2/redirect?token=...&refreshToken=...
// On failure it should redirect here with an `error` param instead, e.g.:
//   https://your-frontend.app/oauth2/redirect?error=oauth_account_exists
export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithOAuthToken } = useAuthContext()
  const ranOnce = useRef(false)

  useEffect(() => {
    if (ranOnce.current) return
    ranOnce.current = true

    const token = searchParams.get('token')
    const refreshToken = searchParams.get('refreshToken')
    const error = searchParams.get('error')

    if (error) {
      toast.error(decodeURIComponent(error.replace(/\+/g, ' ')) || 'OAuth login failed')
      navigate('/login', { replace: true })
      return
    }

    loginWithOAuthToken(token, refreshToken).then((result) => {
      navigate(result.success ? '/dashboard' : '/login', { replace: true })
    })
  }, [searchParams, navigate, loginWithOAuthToken])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-alt">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm">Finishing sign-in…</p>
      </div>
    </div>
  )
}
