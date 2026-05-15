import { Link } from 'react-router-dom'

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '#templates' },
    { label: 'How It Works', href: '#howitworks' },
    { label: 'Pricing', href: '#' },
  ],
  Account: [
    { label: 'Sign Up', href: '/signup' },
    { label: 'Log In', href: '/login' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Project: [
    { label: 'GitHub', href: '#' },
    { label: 'Synopsis', href: '#' },
    { label: 'Report Bug', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-10 px-6 overflow-hidden" style={{ zIndex: 10 }}>

      {/* ── Top wave divider ───────────────────── */}
      <div className="wave-divider absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" height="80">
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z"
            fill="rgba(3,35,64,0.3)"
          />
        </svg>
      </div>

      {/* ── Glow orb ───────────────────────────── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48
                      pointer-events-none"
           style={{
             background: 'radial-gradient(ellipse, rgba(0,255,231,0.05) 0%, transparent 70%)',
           }} />

      <div className="max-w-6xl mx-auto">

        {/* ── Top section ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-full border border-biolum-DEFAULT/50
                              flex items-center justify-center
                              group-hover:border-biolum-DEFAULT transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                    stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="3" fill="#00ffe7" opacity="0.8"/>
                </svg>
              </div>
              <span className="font-display font-bold text-lg glow-text"
                    style={{ color: '#00ffe7' }}>
                Portify
              </span>
            </Link>

            <p className="font-body text-ocean-300 text-sm leading-relaxed max-w-xs mb-6">
              AI-powered portfolio builder for students, developers and creators.
              Build your online presence in minutes — not days.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                {
                  label: 'GitHub',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                  ),
                },
                {
                  label: 'LinkedIn',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  ),
                },
              ].map((s) => (
                <a key={s.label} href="#"
                   className="w-9 h-9 glass rounded-lg flex items-center justify-center
                              text-ocean-300 hover:text-biolum-DEFAULT
                              hover:border-biolum-DEFAULT/30
                              transition-all duration-300">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links cols */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="font-mono text-xs text-biolum-DEFAULT tracking-widest
                             uppercase mb-5">
                {group}
              </h4>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith('/') ? (
                      <Link
                        to={item.href}
                        className="font-body text-sm text-ocean-300
                                   hover:text-foam-white transition-colors duration-300
                                   flex items-center gap-1 group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-biolum-DEFAULT
                                         transition-all duration-300" />
                        {item.label}
                      </Link>
                    ) : (
                      
                      <a href={item.href}
                        className="font-body text-sm text-ocean-300
                                   hover:text-foam-white transition-colors duration-300
                                   flex items-center gap-1 group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-biolum-DEFAULT
                                         transition-all duration-300" />
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ────────────────────────────── */}
        <div className="h-px bg-gradient-to-r from-transparent via-ocean-700/50
                        to-transparent mb-8" />

        {/* ── Bottom bar ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-ocean-500 tracking-wide">
            © 2026 Portify — Built with 🌊 for college project
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-biolum-DEFAULT animate-pulse" />
            <span className="font-mono text-xs text-ocean-400">
              Frontend only — Backend coming soon
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}
