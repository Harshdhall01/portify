import { useEffect, useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Fill Your Details',
    desc: 'Enter your name, bio, skills, projects, education and social links. Everything is optional — add only what you want.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
              stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'AI Picks Your Template',
    desc: 'Grok AI analyzes your profile and selects the most suitable template from 24+ designs. No two portfolios look the same.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#00ffe7" strokeWidth="1.5"/>
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
              stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Preview & Customize',
    desc: 'See your portfolio live in the browser. Swap templates instantly and preview how your profile looks in different styles.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="#00ffe7" strokeWidth="1.5"/>
        <path d="M8 21h8M12 17v4" stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 9l2 2 4-4" stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Deploy & Share',
    desc: 'Hit deploy and your portfolio goes live on Netlify instantly. Get a shareable URL to put on your resume or LinkedIn.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"
              stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
        <polyline points="16 6 12 2 8 6" stroke="#00ffe7" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="2" x2="12" y2="15"
              stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function HowItWorks() {
  const stepRefs = useRef([])
  const lineRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateX(0px)'
          }
        })
      },
      { threshold: 0.2 }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="howitworks" className="relative py-32 px-6" style={{ zIndex: 10 }}>

      {/* ── Background glow ────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[600px] rounded-full"
             style={{
               background: 'radial-gradient(circle, rgba(14,110,184,0.05) 0%, transparent 70%)',
             }} />
      </div>

      {/* ── Section Header ─────────────────────── */}
      <div className="text-center mb-24">
        <span className="font-mono text-xs text-biolum-DEFAULT tracking-widest
                         uppercase mb-4 block">
          How It Works
        </span>
        <h2 className="font-display font-bold text-foam-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          From details to{' '}
          <span style={{
            background: 'linear-gradient(90deg, #7dd4f8, #00ffe7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            live portfolio
          </span>
        </h2>
        <p className="font-body text-ocean-300 max-w-lg mx-auto">
          Four simple steps. No technical knowledge required.
        </p>
      </div>

      {/* ── Steps ──────────────────────────────── */}
      <div className="max-w-5xl mx-auto relative">

        {/* Vertical line connector */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px
                        bg-gradient-to-b from-biolum-DEFAULT/40 via-ocean-600/30 
                        to-transparent hidden sm:block"
             style={{ transform: 'translateX(-50%)' }} />

        <div className="flex flex-col gap-16">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => (stepRefs.current[i] = el)}
              className={`relative flex items-center gap-8 
                          ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              style={{
                opacity: 0,
                transform: `translateX(${i % 2 === 0 ? '-40px' : '40px'})`,
                transition: `opacity 0.7s ease ${i * 0.15}s, 
                             transform 0.7s ease ${i * 0.15}s`,
              }}
            >
              {/* ── Connector dot ────────────────── */}
              <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full
                              bg-biolum-DEFAULT hidden sm:block
                              -translate-x-1/2"
                   style={{
                     boxShadow: '0 0 12px rgba(0,255,231,0.8)',
                   }} />

              {/* ── Card ─────────────────────────── */}
              <div className={`glass p-8 rounded-2xl md:w-5/12 group
                               hover:border-biolum-DEFAULT/30 transition-all duration-500
                               ${i % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} w-full`}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,231,0.1)'
                     e.currentTarget.style.transform = 'translateY(-4px)'
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.boxShadow = 'none'
                     e.currentTarget.style.transform = 'translateY(0)'
                   }}
              >
                {/* Step number */}
                <div className="flex items-center gap-4 mb-5">
                  <span className="font-mono font-bold text-4xl"
                        style={{
                          background: 'linear-gradient(180deg, rgba(0,255,231,0.8), rgba(0,255,231,0.2))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                    {step.number}
                  </span>
                  <div className="w-10 h-10 glass-dark rounded-xl flex items-center
                                  justify-center group-hover:scale-110 
                                  transition-transform duration-300">
                    {step.icon}
                  </div>
                </div>

                <h3 className="font-display font-semibold text-foam-white text-xl mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-ocean-300 text-sm leading-relaxed">
                  {step.desc}
                </p>

                {/* Bottom accent */}
                <div className="mt-5 h-px w-0 bg-gradient-to-r from-biolum-DEFAULT
                                to-transparent group-hover:w-full 
                                transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ─────────────────────────── */}
      <div className="text-center mt-24">
        <p className="font-body text-ocean-300 mb-6 text-sm">
          Ready to build your portfolio?
        </p>
        <a href="/signup"
           className="btn-ocean px-8 py-4 text-base font-semibold inline-flex
                      items-center gap-2 group">
          Start for Free
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

    </section>
  )
}