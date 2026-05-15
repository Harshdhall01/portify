import { useEffect, useRef } from 'react'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#00ffe7" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5" stroke="#00ffe7" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 12l10 5 10-5" stroke="#00ffe7" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'AI-Powered Generation',
    desc: 'Grok AI intelligently reads your details and fills the perfect template — no manual editing needed.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="#00ffe7" strokeWidth="1.5"/>
        <path d="M8 21h8M12 17v4" stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: '24+ Pro Templates',
    desc: 'Handcrafted templates for developers, designers, students and freelancers. Always fresh, never repeat.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#00ffe7" strokeWidth="1.5"/>
        <path d="M12 6v6l4 2" stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Ready in 5 Minutes',
    desc: 'From zero to a live deployed portfolio in under 5 minutes. Fastest way to build your online presence.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="#00ffe7" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Secure & Private',
    desc: 'JWT authentication keeps your data safe. Your portfolio details are yours — always encrypted.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"
              stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
        <polyline points="16 6 12 2 8 6" stroke="#00ffe7" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="2" x2="12" y2="15" stroke="#00ffe7"
              strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'One-Click Deploy',
    desc: 'Deploy your portfolio live to Netlify instantly. Get a shareable URL to send to anyone.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
              stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Dashboard & Edit',
    desc: 'Save multiple portfolios, switch templates anytime, and manage everything from your personal dashboard.',
  },
]

export default function Features() {
  const cardRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0px)'
          }
        })
      },
      { threshold: 0.15 }
    )
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="relative py-32 px-6" style={{ zIndex: 10 }}>

      {/* ── Section Header ─────────────────────── */}
      <div className="text-center mb-20">
        <span className="font-mono text-xs text-biolum-DEFAULT tracking-widest 
                         uppercase mb-4 block">
          Why Portify
        </span>
        <h2 className="font-display font-bold text-foam-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          Everything you need,{' '}
          <span style={{
            background: 'linear-gradient(90deg, #7dd4f8, #00ffe7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            nothing you don't
          </span>
        </h2>
        <p className="font-body text-ocean-300 max-w-lg mx-auto">
          Built for students, developers and creators who want results — not complexity.
        </p>
      </div>

      {/* ── Cards Grid ─────────────────────────── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="glass p-7 group hover:border-biolum-DEFAULT/30
                       transition-all duration-500 cursor-default"
            style={{
              opacity: 0,
              transform: 'translateY(40px)',
              transition: `opacity 0.6s ease ${i * 0.1}s, 
                           transform 0.6s ease ${i * 0.1}s,
                           box-shadow 0.3s ease,
                           border-color 0.3s ease`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,231,0.12)'
              e.currentTarget.style.transform = 'translateY(-6px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0px)'
            }}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl glass-dark flex items-center 
                            justify-center mb-5 group-hover:scale-110 
                            transition-transform duration-300">
              {f.icon}
            </div>

            {/* Text */}
            <h3 className="font-display font-semibold text-foam-white text-lg mb-2">
              {f.title}
            </h3>
            <p className="font-body text-ocean-300 text-sm leading-relaxed">
              {f.desc}
            </p>

            {/* Bottom glow line */}
            <div className="mt-6 h-px w-0 bg-gradient-to-r from-biolum-DEFAULT to-transparent
                            group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>

    </section>
  )
}