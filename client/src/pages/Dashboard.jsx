import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Dashboard() {
  const navigate        = useNavigate()
  const { user, logout } = useAuth()

  const [portfolios, setPortfolios] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError]             = useState('')
  const [deletingId, setDeletingId]   = useState(null)

  // ── Fetch portfolios from backend ────────────────────────────
  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoadingData(true)
      setError('')
      try {
        const res = await api.get('/portfolio/my')
        setPortfolios(res.data.portfolios || [])
      } catch (err) {
        // If not logged in or token expired
        if (err.response?.status === 401) {
          logout()
          navigate('/login')
          return
        }
        // Fall back to localStorage if API fails
        const data = localStorage.getItem('portify_data')
        const tpl  = localStorage.getItem('portify_template')
        if (data) {
          const parsed = JSON.parse(data)
          setPortfolios([{
            _id: 'local-1',
            name: parsed.personal?.name || 'My Portfolio',
            templateId: tpl || '1',
            updatedAt: new Date().toISOString(),
            status: 'draft',
            isLocal: true,
          }])
        }
        setError('Could not reach server — showing locally saved data.')
      } finally {
        setLoadingData(false)
      }
    }

    fetchPortfolios()
  }, [])

  // ── Delete portfolio ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await api.delete(`/portfolio/${id}`)
      setPortfolios((prev) => prev.filter((p) => p._id !== id))
    } catch {
      alert('Failed to delete portfolio. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  // ── Load portfolio into builder for editing ──────────────────
  const handleEdit = (portfolio) => {
    if (!portfolio.isLocal) {
      localStorage.setItem('portify_data', JSON.stringify({
        personal:  portfolio.personal  || {},
        skills:    portfolio.skills    || {},
        projects:  portfolio.projects  || [],
        education: portfolio.education || [],
        socials:   portfolio.socials   || {},
      }))
      localStorage.setItem('portify_template', String(portfolio.templateId || '1'))
      localStorage.setItem('portify_editing_id', portfolio._id)
    }
    navigate('/builder')
  }

  // ── Load portfolio into preview ──────────────────────────────
  const handleView = (portfolio) => {
    if (!portfolio.isLocal) {
      localStorage.setItem('portify_data', JSON.stringify({
        personal:  portfolio.personal  || {},
        skills:    portfolio.skills    || {},
        projects:  portfolio.projects  || [],
        education: portfolio.education || [],
        socials:   portfolio.socials   || {},
      }))
      localStorage.setItem('portify_template', String(portfolio.templateId || '1'))
    }
    navigate('/preview')
  }

  const stats = [
    { label: 'Portfolios', value: portfolios.length, icon: '🗂️' },
    { label: 'Templates',  value: '24',              icon: '🎨' },
    { label: 'Deployed',   value: portfolios.filter(p => p.status === 'live').length, icon: '🚀' },
  ]

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || null

  return (
    <div className="min-h-screen relative" style={{ background: '#010b18' }}>
      <Navbar />

      {/* bg glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2
                        w-[600px] h-[600px] rounded-full"
             style={{
               background: 'radial-gradient(circle, rgba(14,110,184,0.05) 0%, transparent 70%)',
             }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20" style={{ zIndex: 10 }}>

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs text-biolum-DEFAULT tracking-widest
                             uppercase mb-2 block">
              Welcome back
            </span>
            <h1 className="font-display font-bold text-foam-white"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              {firstName ? `Hey, ${firstName} 👋` : 'Your Dashboard'}
            </h1>
            {user?.email && (
              <p className="font-mono text-xs text-ocean-400 mt-1">{user.email}</p>
            )}
          </div>
          <button
            onClick={() => navigate('/builder')}
            className="btn-ocean px-6 py-3 text-sm font-semibold flex items-center gap-2 group"
          >
            + New Portfolio
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* ── Error Banner ─────────────────────────────────────── */}
        {error && (
          <div className="mb-8 px-4 py-3 rounded-xl text-sm font-mono
                          bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            ⚠ {error}
          </div>
        )}

        {/* ── Stats ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6 border border-ocean-700/40
                                          flex flex-col items-center text-center">
              <span className="text-2xl mb-2">{s.icon}</span>
              <span className="font-display font-bold text-3xl text-foam-white mb-1">
                {s.value}
              </span>
              <span className="font-mono text-xs text-ocean-400 tracking-widest uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Portfolios Section ───────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-foam-white">
            My Portfolios
          </h2>
          <span className="font-mono text-xs text-ocean-400 tracking-widest uppercase">
            {portfolios.length} total
          </span>
        </div>

        {/* Loading state */}
        {loadingData ? (
          <div className="glass rounded-2xl p-16 border border-ocean-700/40
                          flex flex-col items-center text-center">
            <div className="w-8 h-8 border-2 border-biolum-DEFAULT/30
                            border-t-biolum-DEFAULT rounded-full animate-spin mb-4" />
            <p className="font-mono text-xs text-ocean-400 tracking-widest uppercase">
              Loading your portfolios...
            </p>
          </div>

        ) : portfolios.length === 0 ? (
          /* Empty state */
          <div className="glass rounded-2xl p-16 border border-ocean-700/40
                          flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center
                            text-3xl mb-4 border border-biolum-DEFAULT/20">
              🌊
            </div>
            <h3 className="font-display font-bold text-xl text-foam-white mb-2">
              No portfolios yet
            </h3>
            <p className="font-body text-sm text-ocean-400 mb-6 max-w-xs">
              Create your first portfolio in under 5 minutes with AI
            </p>
            <button
              onClick={() => navigate('/builder')}
              className="btn-ocean px-6 py-3 text-sm font-semibold"
            >
              Build My Portfolio
            </button>
          </div>

        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {portfolios.map((p) => (
              <div key={p._id}
                   className="glass rounded-2xl p-6 border border-ocean-700/40
                              hover:border-biolum-DEFAULT/30 transition-all duration-300 group">

                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-foam-white mb-1">
                      {p.personal?.name || p.name || 'My Portfolio'}
                    </h3>
                    <span className="font-mono text-xs text-ocean-400">
                      Template #{p.templateId || '1'} · Updated{' '}
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </span>
                    {p.isLocal && (
                      <span className="ml-2 font-mono text-xs text-yellow-400/70">
                        (local only)
                      </span>
                    )}
                  </div>
                  <span className={`font-mono text-xs px-3 py-1 rounded-full border
                    ${p.status === 'live'
                      ? 'text-green-400 border-green-400/30 bg-green-400/10'
                      : 'text-ocean-400 border-ocean-600/40 bg-ocean-800/30'}`}>
                    {p.status || 'draft'}
                  </span>
                </div>

                {/* Preview thumbnail */}
                <div className="w-full h-32 rounded-xl mb-4 flex items-center justify-center
                                border border-ocean-700/30 overflow-hidden
                                bg-gradient-to-br from-ocean-900 to-ocean-950">
                  <span className="font-mono text-xs text-ocean-500 tracking-widest uppercase">
                    Portfolio Preview
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleView(p)}
                    className="btn-ocean px-4 py-2 text-xs font-mono flex-1"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(p)}
                    className="btn-outline-ocean px-4 py-2 text-xs font-mono flex-1"
                  >
                    Edit
                  </button>
                  {!p.isLocal && (
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deletingId === p._id}
                      className="px-4 py-2 text-xs font-mono rounded-xl
                                 border border-red-500/30 text-red-400
                                 hover:bg-red-500/10 transition-all duration-300
                                 disabled:opacity-40"
                    >
                      {deletingId === p._id ? '...' : '🗑 Delete'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Bottom tip ───────────────────────────────────────── */}
        <div className="mt-12 glass rounded-2xl p-6 border border-biolum-DEFAULT/10
                        flex items-center gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-body text-sm text-foam-white mb-1">
              Your portfolios are saved to your account
            </p>
            <p className="font-body text-xs text-ocean-400">
              Edit anytime, preview instantly, and deploy with one click — coming in Phase 4.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}