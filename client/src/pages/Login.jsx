import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WaterBackground from '../components/WaterBackground.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: connect to backend
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <WaterBackground />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full bg-biolum-DEFAULT opacity-20
                              group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative w-9 h-9 rounded-full border border-biolum-DEFAULT/50
                              flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                        stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" fill="#00ffe7" opacity="0.8" />
                </svg>
              </div>
            </div>
            <span className="font-display font-bold text-xl tracking-wide"
                  style={{ color: '#00ffe7' }}>
              Portify
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-foam-white mt-6 mb-2">
            Welcome back
          </h1>
          <p className="font-body text-sm text-ocean-300">
            Sign in to your account to continue
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-ocean-700/40">

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30
                            text-red-400 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-ocean-300 tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-ocean-900/60 border border-ocean-700/50 rounded-xl
                           px-4 py-3 text-foam-white font-body text-sm
                           placeholder:text-ocean-500
                           focus:outline-none focus:border-biolum-DEFAULT/60
                           focus:ring-1 focus:ring-biolum-DEFAULT/30
                           transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs text-ocean-300 tracking-widest uppercase">
                  Password
                </label>
                <a href="#" className="font-body text-xs text-biolum-DEFAULT hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-ocean-900/60 border border-ocean-700/50 rounded-xl
                           px-4 py-3 text-foam-white font-body text-sm
                           placeholder:text-ocean-500
                           focus:outline-none focus:border-biolum-DEFAULT/60
                           focus:ring-1 focus:ring-biolum-DEFAULT/30
                           transition-all duration-300"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-ocean w-full py-3 text-sm font-semibold mt-2
                         flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ocean-700/40" />
            <span className="font-mono text-xs text-ocean-500">or</span>
            <div className="flex-1 h-px bg-ocean-700/40" />
          </div>

          {/* Google OAuth placeholder */}
          <button className="w-full flex items-center justify-center gap-3
                             border border-ocean-700/50 rounded-xl py-3
                             font-body text-sm text-ocean-200
                             hover:border-biolum-DEFAULT/40 hover:text-foam-white
                             transition-all duration-300 bg-ocean-900/30">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

        </div>

        {/* Footer link */}
        <p className="text-center font-body text-sm text-ocean-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-biolum-DEFAULT hover:underline font-medium">
            Sign up free
          </Link>
        </p>

      </div>
    </div>
  )
}