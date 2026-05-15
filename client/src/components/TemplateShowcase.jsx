import { useState } from 'react'

const templates = [
  {
    id: 1,
    name: 'Deep Ocean',
    tag: 'Developer',
    color: '#0e6eb8',
    accent: '#00ffe7',
    preview: 'bg-gradient-to-br from-ocean-950 via-ocean-800 to-ocean-600',
  },
  {
    id: 2,
    name: 'Midnight Coral',
    tag: 'Designer',
    color: '#ff6b6b',
    accent: '#ffd93d',
    preview: 'bg-gradient-to-br from-gray-950 via-rose-900 to-orange-800',
  },
  {
    id: 3,
    name: 'Forest Depth',
    tag: 'Fullstack',
    color: '#2d6a4f',
    accent: '#74c69d',
    preview: 'bg-gradient-to-br from-gray-950 via-green-900 to-emerald-700',
  },
  {
    id: 4,
    name: 'Neon Void',
    tag: 'Creative',
    color: '#7b2ff7',
    accent: '#f72585',
    preview: 'bg-gradient-to-br from-gray-950 via-purple-900 to-pink-800',
  },
  {
    id: 5,
    name: 'Arctic Mist',
    tag: 'Student',
    color: '#a8dadc',
    accent: '#457b9d',
    preview: 'bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-800',
  },
  {
    id: 6,
    name: 'Solar Flare',
    tag: 'Freelancer',
    color: '#f4a261',
    accent: '#e76f51',
    preview: 'bg-gradient-to-br from-gray-950 via-orange-900 to-yellow-800',
  },
]

export default function TemplateShowcase() {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(null)

  return (
    <section id="templates" className="relative py-32 px-6" style={{ zIndex: 10 }}>

      {/* ── Glow ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
             style={{
               background: 'radial-gradient(circle, rgba(0,255,231,0.04) 0%, transparent 70%)',
             }} />
      </div>

      {/* ── Header ─────────────────────────────── */}
      <div className="text-center mb-20">
        <span className="font-mono text-xs text-biolum-DEFAULT tracking-widest
                         uppercase mb-4 block">
          Templates
        </span>
        <h2 className="font-display font-bold text-foam-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          24+ designs,{' '}
          <span style={{
            background: 'linear-gradient(90deg, #7dd4f8, #00ffe7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            zero repeats
          </span>
        </h2>
        <p className="font-body text-ocean-300 max-w-lg mx-auto">
          AI picks the best one for your profile. You can always swap it.
        </p>
      </div>

      {/* ── Template Grid ──────────────────────── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t, i) => (
          <div
            key={t.id}
            className={`relative rounded-2xl overflow-hidden cursor-pointer
                        transition-all duration-500 group
                        ${active === i
                          ? 'ring-2 ring-biolum-DEFAULT shadow-ocean-glow'
                          : 'ring-1 ring-ocean-700/40'}`}
            style={{ height: '280px' }}
            onClick={() => setActive(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* ── Template Preview ─────────────── */}
            <div className={`absolute inset-0 ${t.preview} 
                             transition-transform duration-700
                             ${hovered === i ? 'scale-105' : 'scale-100'}`} />

            {/* ── Mock UI inside template ──────── */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between">

              {/* Mock navbar */}
              <div className="flex items-center justify-between">
                <div className="w-16 h-2 rounded-full opacity-60"
                     style={{ background: t.accent }} />
                <div className="flex gap-2">
                  {[1,2,3].map(n => (
                    <div key={n} className="w-8 h-1.5 rounded-full bg-white/20" />
                  ))}
                </div>
              </div>

              {/* Mock hero content */}
              <div className="flex flex-col gap-2">
                <div className="w-8 h-8 rounded-full mb-1"
                     style={{ background: t.accent, opacity: 0.8 }} />
                <div className="w-32 h-3 rounded-full bg-white/70" />
                <div className="w-24 h-2 rounded-full bg-white/40" />
                <div className="flex gap-2 mt-2">
                  <div className="w-16 h-5 rounded-full"
                       style={{ background: t.accent, opacity: 0.9 }} />
                  <div className="w-16 h-5 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Mock skills */}
              <div className="flex gap-2 flex-wrap">
                {[1,2,3,4].map(n => (
                  <div key={n} className="w-10 h-2 rounded-full bg-white/20" />
                ))}
              </div>
            </div>

            {/* ── Overlay on hover ─────────────── */}
            <div className={`absolute inset-0 flex flex-col items-center 
                             justify-center gap-3 transition-all duration-300
                             ${hovered === i
                               ? 'opacity-100 backdrop-blur-sm bg-ocean-950/60'
                               : 'opacity-0'}`}>
              <span className="font-display font-bold text-foam-white text-lg">
                {t.name}
              </span>
              <span className="font-mono text-xs px-3 py-1 rounded-full"
                    style={{
                      background: `${t.accent}22`,
                      border: `1px solid ${t.accent}66`,
                      color: t.accent,
                    }}>
                {t.tag}
              </span>
              {active === i && (
                <span className="font-mono text-xs text-biolum-DEFAULT
                                 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-biolum-DEFAULT 
                                   animate-pulse" />
                  Selected
                </span>
              )}
            </div>

            {/* ── Selected badge ───────────────── */}
            {active === i && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full
                              bg-biolum-DEFAULT flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#010b18"
                        strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── More templates note ────────────────── */}
      <div className="text-center mt-12">
        <p className="font-mono text-xs text-ocean-400 tracking-widest uppercase">
          + 18 more templates available after signup
        </p>
      </div>

    </section>
  )
}