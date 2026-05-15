import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const TOTAL_STEPS = 5

const stepTitles = [
  { step: 1, label: 'Personal Info', icon: '👤' },
  { step: 2, label: 'Skills',        icon: '⚡' },
  { step: 3, label: 'Projects',      icon: '🚀' },
  { step: 4, label: 'Education',     icon: '🎓' },
  { step: 5, label: 'Social Links',  icon: '🔗' },
]

const emptyProject = { title: '', desc: '', link: '', tech: '' }
const emptyEdu     = { degree: '', school: '', year: '', grade: '' }

export default function Builder() {
  const navigate    = useNavigate()
  const { user }    = useAuth()

  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const [personal, setPersonal] = useState({
    name: '', title: '', bio: '', email: '', phone: '', location: '', photo: '',
  })
  const [skills, setSkills]       = useState({ technical: '', soft: '', tools: '' })
  const [projects, setProjects]   = useState([{ ...emptyProject }])
  const [education, setEducation] = useState([{ ...emptyEdu }])
  const [socials, setSocials]     = useState({
    github: '', linkedin: '', twitter: '', website: '', instagram: '',
  })

  // ── Navigation ───────────────────────────────────────────────
  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const prev = () => setStep((s) => Math.max(s - 1, 1))

  // ── Project helpers ──────────────────────────────────────────
  const addProject    = () => setProjects([...projects, { ...emptyProject }])
  const updateProject = (i, field, val) => {
    const u = [...projects]; u[i][field] = val; setProjects(u)
  }
  const removeProject = (i) => setProjects(projects.filter((_, idx) => idx !== i))

  // ── Education helpers ────────────────────────────────────────
  const addEdu    = () => setEducation([...education, { ...emptyEdu }])
  const updateEdu = (i, field, val) => {
    const u = [...education]; u[i][field] = val; setEducation(u)
  }
  const removeEdu = (i) => setEducation(education.filter((_, idx) => idx !== i))

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const lastTemplateId = parseInt(localStorage.getItem('portify_last_template') || '0')
    const formData = { personal, skills, projects, education, socials }
    const editingId = localStorage.getItem('portify_editing_id') || null

    // Always save to localStorage as backup
    localStorage.setItem('portify_data', JSON.stringify(formData))

    try {
      if (user) {
        // ── Logged in: call backend generate endpoint ─────────
        const res = await api.post('/api/portfolios/generate', {
          ...formData,
          lastTemplateId,
          editingId,
        })

        const { templateId, aiEnhanced, designReason, portfolio } = res.data

        // ✅ Save portfolio ID so Preview can publish it
        localStorage.setItem('portify_portfolio_id',  portfolio._id)
        localStorage.setItem('portify_template',       String(templateId))
        localStorage.setItem('portify_last_template',  String(templateId))
        localStorage.removeItem('portify_editing_id')

        console.log(aiEnhanced
          ? `🤖 AI picked template #${templateId}: ${designReason}`
          : `🎲 Random fallback: template #${templateId}`)

      } else {
        // ── Guest: random template, localStorage only ─────────
        let picked
        do { picked = Math.floor(Math.random() * 24) + 1 } while (picked === lastTemplateId)
        localStorage.setItem('portify_template',      String(picked))
        localStorage.setItem('portify_last_template', String(picked))
        localStorage.removeItem('portify_portfolio_id')
      }

      setTimeout(() => { setLoading(false); navigate('/preview') }, 1500)

    } catch (err) {
      setLoading(false)
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
    }
  }

  // ── Shared input classes ─────────────────────────────────────
  const inp = 'input-ocean w-full px-4 py-3 text-sm'
  const lbl = 'font-mono text-xs text-ocean-300 tracking-wider uppercase mb-2 block'

  return (
    <div className="min-h-screen relative" style={{ background: '#010b18' }}>
      <Navbar />

      {/* bg glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2
                        w-[600px] h-[600px] rounded-full"
             style={{
               background: 'radial-gradient(circle, rgba(14,110,184,0.06) 0%, transparent 70%)',
             }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 pt-32 pb-20" style={{ zIndex: 10 }}>

        {/* ── Header ──────────────────────────────────── */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs text-biolum-DEFAULT tracking-widest
                           uppercase mb-3 block">
            Step {step} of {TOTAL_STEPS}
          </span>
          <h1 className="font-display font-bold text-foam-white mb-2"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            Build Your Portfolio
          </h1>
          <p className="font-body text-ocean-300 text-sm">
            All fields are optional — fill what you want to show
          </p>
          {!user && (
            <p className="font-mono text-xs text-yellow-400/70 mt-2">
              ⚠ Not logged in — your portfolio won't be saved to your account
            </p>
          )}
        </div>

        {/* ── Progress Bar ──────────────────────────── */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-ocean-700/40" />
          <div className="absolute top-4 left-0 h-px bg-gradient-to-r
                          from-biolum-DEFAULT to-ocean-400 transition-all duration-500"
               style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }} />
          {stepTitles.map((s) => (
            <div key={s.step}
                 className="relative flex flex-col items-center gap-2 cursor-pointer"
                 onClick={() => setStep(s.step)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                               text-sm transition-all duration-300 z-10
                               ${step === s.step
                                 ? 'bg-biolum-DEFAULT text-ocean-950 shadow-ocean-glow'
                                 : step > s.step
                                   ? 'bg-ocean-600 text-foam-white'
                                   : 'glass text-ocean-400'}`}>
                {step > s.step ? '✓' : s.icon}
              </div>
              <span className={`font-mono text-xs hidden md:block transition-colors
                                ${step === s.step ? 'text-biolum-DEFAULT' : 'text-ocean-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Form Card ──────────────────────────────── */}
        <div className="glass p-8 rounded-2xl">

          {/* ══ STEP 1 – Personal Info ══════════════ */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-display font-semibold text-foam-white text-xl mb-2">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Full Name</label>
                  <input type="text" placeholder="e.g. Harsh Sharma"
                         value={personal.name} className={inp}
                         onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
                </div>
                <div>
                  <label className={lbl}>Professional Title</label>
                  <input type="text" placeholder="e.g. Full Stack Developer"
                         value={personal.title} className={inp}
                         onChange={(e) => setPersonal({ ...personal, title: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={lbl}>Bio</label>
                <textarea rows={4} placeholder="Tell the world about yourself..."
                          value={personal.bio} className={`${inp} resize-none`}
                          onChange={(e) => setPersonal({ ...personal, bio: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Email</label>
                  <input type="email" placeholder="you@email.com"
                         value={personal.email} className={inp}
                         onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
                </div>
                <div>
                  <label className={lbl}>Phone</label>
                  <input type="text" placeholder="+91 98765 43210"
                         value={personal.phone} className={inp}
                         onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Location</label>
                  <input type="text" placeholder="e.g. Delhi, India"
                         value={personal.location} className={inp}
                         onChange={(e) => setPersonal({ ...personal, location: e.target.value })} />
                </div>
                <div>
                  <label className={lbl}>Photo URL</label>
                  <input type="text" placeholder="https://your-photo.com/img.jpg"
                         value={personal.photo} className={inp}
                         onChange={(e) => setPersonal({ ...personal, photo: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2 – Skills ════════════════════ */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-display font-semibold text-foam-white text-xl mb-1">
                Skills & Tools
              </h2>
              <p className="font-body text-ocean-400 text-xs -mt-2">
                Separate each skill with a comma
              </p>
              <div>
                <label className={lbl}>Technical Skills</label>
                <textarea rows={3} placeholder="React, Node.js, Python, MongoDB..."
                          value={skills.technical} className={`${inp} resize-none`}
                          onChange={(e) => setSkills({ ...skills, technical: e.target.value })} />
              </div>
              <div>
                <label className={lbl}>Tools & Technologies</label>
                <textarea rows={3} placeholder="Git, Docker, Figma, VS Code..."
                          value={skills.tools} className={`${inp} resize-none`}
                          onChange={(e) => setSkills({ ...skills, tools: e.target.value })} />
              </div>
              <div>
                <label className={lbl}>Soft Skills</label>
                <textarea rows={3} placeholder="Leadership, Communication..."
                          value={skills.soft} className={`${inp} resize-none`}
                          onChange={(e) => setSkills({ ...skills, soft: e.target.value })} />
              </div>
            </div>
          )}

          {/* ══ STEP 3 – Projects ══════════════════ */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h2 className="font-display font-semibold text-foam-white text-xl mb-1">
                Projects
              </h2>
              {projects.map((p, i) => (
                <div key={i} className="glass-dark p-5 rounded-xl relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-biolum-DEFAULT tracking-wider uppercase">
                      Project {i + 1}
                    </span>
                    {projects.length > 1 && (
                      <button onClick={() => removeProject(i)}
                              className="text-ocean-400 hover:text-red-400
                                         transition-colors text-xs font-mono">
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={lbl}>Project Title</label>
                        <input type="text" placeholder="e.g. Portify"
                               value={p.title} className={inp}
                               onChange={(e) => updateProject(i, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className={lbl}>Live Link</label>
                        <input type="text" placeholder="https://project.com"
                               value={p.link} className={inp}
                               onChange={(e) => updateProject(i, 'link', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Tech Used</label>
                      <input type="text" placeholder="React, Node.js, MongoDB..."
                             value={p.tech} className={inp}
                             onChange={(e) => updateProject(i, 'tech', e.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Description</label>
                      <textarea rows={3} placeholder="What does this project do?"
                                value={p.desc} className={`${inp} resize-none`}
                                onChange={(e) => updateProject(i, 'desc', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addProject}
                      className="btn-outline-ocean px-5 py-2.5 text-sm w-fit
                                 flex items-center gap-2">
                + Add Another Project
              </button>
            </div>
          )}

          {/* ══ STEP 4 – Education ════════════════ */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h2 className="font-display font-semibold text-foam-white text-xl mb-1">
                Education & Experience
              </h2>
              {education.map((e, i) => (
                <div key={i} className="glass-dark p-5 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-biolum-DEFAULT tracking-wider uppercase">
                      Entry {i + 1}
                    </span>
                    {education.length > 1 && (
                      <button onClick={() => removeEdu(i)}
                              className="text-ocean-400 hover:text-red-400
                                         transition-colors text-xs font-mono">
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Degree / Course</label>
                      <input type="text" placeholder="B.Tech Computer Science"
                             value={e.degree} className={inp}
                             onChange={(ev) => updateEdu(i, 'degree', ev.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>School / College</label>
                      <input type="text" placeholder="Delhi University"
                             value={e.school} className={inp}
                             onChange={(ev) => updateEdu(i, 'school', ev.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Year</label>
                      <input type="text" placeholder="2022 – 2026"
                             value={e.year} className={inp}
                             onChange={(ev) => updateEdu(i, 'year', ev.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Grade / CGPA</label>
                      <input type="text" placeholder="8.5 CGPA"
                             value={e.grade} className={inp}
                             onChange={(ev) => updateEdu(i, 'grade', ev.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addEdu}
                      className="btn-outline-ocean px-5 py-2.5 text-sm w-fit
                                 flex items-center gap-2">
                + Add Another Entry
              </button>
            </div>
          )}

          {/* ══ STEP 5 – Socials ══════════════════ */}
          {step === 5 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-display font-semibold text-foam-white text-xl mb-1">
                Social Links
              </h2>
              <p className="font-body text-ocean-400 text-xs -mt-2">
                Add links to your profiles — all optional
              </p>
              {[
                { key: 'github',    label: 'GitHub',    placeholder: 'https://github.com/username' },
                { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/username' },
                { key: 'twitter',   label: 'Twitter/X', placeholder: 'https://twitter.com/username' },
                { key: 'website',   label: 'Website',   placeholder: 'https://yourwebsite.com' },
                { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
              ].map((s) => (
                <div key={s.key}>
                  <label className={lbl}>{s.label}</label>
                  <input type="text" placeholder={s.placeholder}
                         value={socials[s.key]} className={inp}
                         onChange={(e) => setSocials({ ...socials, [s.key]: e.target.value })} />
                </div>
              ))}

              {/* Summary preview */}
              <div className="glass-dark p-5 rounded-xl mt-2">
                <p className="font-mono text-xs text-biolum-DEFAULT tracking-wider
                               uppercase mb-3">
                  Your Portfolio Summary
                </p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: 'Name',      val: personal.name  || '—' },
                    { label: 'Title',     val: personal.title || '—' },
                    { label: 'Skills',    val: skills.technical
                                                ? skills.technical.split(',').slice(0,3).join(', ') + '...'
                                                : '—' },
                    { label: 'Projects',  val: `${projects.filter(p => p.title).length} added` },
                    { label: 'Education', val: `${education.filter(e => e.degree).length} added` },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-3">
                      <span className="font-mono text-xs text-ocean-400 w-20">{r.label}</span>
                      <span className="font-body text-sm text-foam-white">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Error Message ──────────────────────────────────── */}
          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl text-sm font-mono
                            bg-red-500/10 border border-red-500/30 text-red-400">
              ⚠ {error}
            </div>
          )}

          {/* ── Nav Buttons ───────────────────────────────────── */}
          <div className="flex items-center justify-between mt-8 pt-6
                          border-t border-ocean-700/30">
            <button onClick={prev} disabled={step === 1}
                    className="btn-outline-ocean px-6 py-2.5 text-sm font-medium
                               disabled:opacity-30 disabled:cursor-not-allowed">
              ← Back
            </button>

            {step < TOTAL_STEPS ? (
              <button onClick={next}
                      className="btn-ocean px-6 py-2.5 text-sm font-medium">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                      className="btn-ocean px-8 py-2.5 text-sm font-semibold
                                 flex items-center gap-2">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-ocean-950/30
                                     border-t-ocean-950 rounded-full animate-spin" />
                    Generating...
                  </>
                ) : 'Generate Portfolio ✨'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}