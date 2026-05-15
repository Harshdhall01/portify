import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#howitworks' },
    { label: 'Templates', href: '#templates' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-dark py-3 shadow-deep' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full bg-biolum-DEFAULT opacity-20 group-hover:opacity-40 transition-opacity duration-300 animate-glow-pulse" />
              <div className="relative w-9 h-9 rounded-full border border-biolum-DEFAULT/50 flex items-center justify-center group-hover:border-biolum-DEFAULT transition-colors duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                        stroke="#00ffe7" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" fill="#00ffe7" opacity="0.8" />
                </svg>
              </div>
            </div>
            <span className="font-display font-bold text-xl tracking-wide glow-text" style={{ color: '#00ffe7' }}>
              Portify
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}
                   className="font-body text-sm font-medium text-ocean-200 hover:text-biolum-DEFAULT transition-colors duration-300 relative group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-biolum-DEFAULT group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-outline-ocean px-5 py-2 text-sm font-medium">Log In</Link>
            <Link to="/signup" className="btn-ocean px-5 py-2 text-sm font-medium">Get Started</Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden flex flex-col gap-1.5 p-2"
                  aria-label="Toggle menu">
            <span className={`block w-6 h-px bg-biolum-DEFAULT transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-px bg-biolum-DEFAULT transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-biolum-DEFAULT transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        <div className={`md:hidden glass-dark mx-4 mt-2 rounded-2xl overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                 className="font-body text-ocean-200 hover:text-biolum-DEFAULT transition-colors duration-300 text-sm font-medium">
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-2 border-t border-ocean-700/30">
              <Link to="/login" className="btn-outline-ocean px-5 py-2.5 text-sm text-center">Log In</Link>
              <Link to="/signup" className="btn-ocean px-5 py-2.5 text-sm text-center">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}