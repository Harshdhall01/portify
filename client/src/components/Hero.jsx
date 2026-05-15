import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  const titleRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let rafId
    const onMove = (e) => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        })
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const letters = 'PORTIFY'.split('')

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden cursor-default"
      style={{ zIndex: 10, pointerEvents: 'none' }}
    >

      {/* Ambient glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
           style={{
             background: 'radial-gradient(circle, rgba(0,255,231,0.06) 0%, transparent 70%)',
             transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
             transition: 'transform 0.3s ease',
           }} />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
           style={{
             background: 'radial-gradient(circle, rgba(14,110,184,0.08) 0%, transparent 70%)',
             transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
             transition: 'transform 0.3s ease',
           }} />

      {/* Badge */}
      <div className="glass px-4 py-1.5 rounded-full mb-8 flex items-center gap-2
                      animate-float border border-biolum-DEFAULT/20"
           style={{ pointerEvents: 'none' }}>
        <span className="w-2 h-2 rounded-full bg-biolum-DEFAULT animate-pulse" />
        <span className="text-xs font-mono text-biolum-DEFAULT tracking-widest uppercase">
          AI – Powered Portfolio Builder
        </span>
      </div>

      {/* Main Title */}
      <div
        ref={titleRef}
        className="relative mb-6"
        style={{
          transform: `perspective(800px) rotateX(${mousePos.y * -4}deg) rotateY(${mousePos.x * 4}deg)`,
          transition: 'transform 0.1s ease',
          pointerEvents: 'none',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center
                        select-none pointer-events-none"
             style={{ transform: 'translateZ(-20px) translateY(8px)' }}>
          <span className="font-display font-black select-none"
                style={{
                  fontSize: 'clamp(4rem, 14vw, 11rem)',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(0,255,231,0.08)',
                  letterSpacing: '-0.02em',
                  filter: 'blur(8px)',
                }}>
            PORTIFY
          </span>
        </div>

        <h1 className="font-display font-black flex items-center justify-center select-none"
            style={{
              fontSize: 'clamp(4rem, 14vw, 11rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
          {letters.map((letter, i) => (
            <span
              key={i}
              className="inline-block cursor-default"
              style={{
                background: 'linear-gradient(180deg, #e8f8ff 0%, #7dd4f8 40%, #00ffe7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(0,255,231,0.4))',
                animation: 'float 6s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>

      {/* Tagline */}
      <p className="font-body text-ocean-200 max-w-xl mx-auto mb-4 leading-relaxed"
         style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', pointerEvents: 'none' }}>
        Generate a stunning portfolio website in{' '}
        <span className="text-biolum-DEFAULT font-semibold">under 5 minutes.</span>
        {' '}Just fill your details – AI does the rest.
      </p>

      <p className="font-mono text-xs text-ocean-400 mb-10 tracking-widest uppercase"
         style={{ pointerEvents: 'none' }}>
        No coding · No design skills · Just you
      </p>

      {/* CTA Buttons — pointer events back ON so buttons are clickable */}
      <div className="flex flex-col sm:flex-row items-center gap-4"
           style={{ pointerEvents: 'auto' }}>
        <Link
          to="/signup"
          className="btn-ocean px-8 py-4 text-base font-semibold
                     flex items-center gap-2 group cursor-pointer"
        >
          Build My Portfolio
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        
          <a href="#templates"
          className="btn-outline-ocean px-8 py-4 text-base font-semibold
                     flex items-center gap-2 cursor-pointer"
        >
          View Templates
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2
                      flex flex-col items-center gap-2 animate-float-delayed"
           style={{ pointerEvents: 'none' }}>
        <span className="font-mono text-xs text-ocean-400 tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-biolum-DEFAULT to-transparent" />
      </div>

    </section>
  )
}
