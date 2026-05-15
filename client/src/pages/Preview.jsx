import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

// ── Template renderer ─────────────────────────────────────────
function renderTemplate(data, templateId) {
  const { personal, skills, projects, education, socials } = data
  const techSkills = skills?.technical?.split(',').map(s => s.trim()).filter(Boolean) || []
  const toolSkills = skills?.tools?.split(',').map(s => s.trim()).filter(Boolean) || []
  const softSkills = skills?.soft?.split(',').map(s => s.trim()).filter(Boolean) || []

  const avatarHtml = personal?.photo
    ? `<img src="${personal.photo}" class="avatar" alt="${personal.name}"/>`
    : `<div class="avatar-placeholder">${personal?.name ? personal.name.charAt(0).toUpperCase() : '?'}</div>`

  const skillsSection = () => (techSkills.length || toolSkills.length || softSkills.length) ? `
<section id="skills">
  <p class="section-sub">What I Know</p>
  <h2 class="section-title">Skills & Tools</h2>
  ${techSkills.length ? `<p class="skills-label">TECHNICAL</p><div class="skills-grid mb">${techSkills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div>` : ''}
  ${toolSkills.length ? `<p class="skills-label">TOOLS</p><div class="skills-grid mb">${toolSkills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div>` : ''}
  ${softSkills.length ? `<p class="skills-label">SOFT SKILLS</p><div class="skills-grid">${softSkills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div>` : ''}
</section>` : ''

  const projectsSection = () => projects?.filter(p=>p.title).length ? `
<section id="projects">
  <p class="section-sub">What I've Built</p>
  <h2 class="section-title">Projects</h2>
  ${projects.filter(p=>p.title).map(p=>`
  <div class="project-card">
    <p class="project-title">${p.title}</p>
    ${p.desc ? `<p class="project-desc">${p.desc}</p>` : ''}
    ${p.tech ? `<div class="project-tech">${p.tech.split(',').map(t=>`<span class="tech-tag">${t.trim()}</span>`).join('')}</div>` : ''}
    ${p.link ? `<a href="${p.link}" class="project-link" target="_blank">View Project →</a>` : ''}
  </div>`).join('')}
</section>` : ''

  const educationSection = () => education?.filter(e=>e.degree).length ? `
<section id="education">
  <p class="section-sub">My Journey</p>
  <h2 class="section-title">Education</h2>
  ${education.filter(e=>e.degree).map(e=>`
  <div class="edu-card">
    <p class="edu-degree">${e.degree}</p>
    <p class="edu-school">${e.school || ''}</p>
    <p class="edu-meta">${e.year || ''}${e.grade ? ' · ' + e.grade : ''}</p>
  </div>`).join('')}
</section>` : ''

  const contactSection = () => `
<section id="contact">
  <p class="section-sub">Get In Touch</p>
  <h2 class="section-title" style="text-align:center">Contact</h2>
  <div class="contact-info">
    ${personal?.email    ? `<span class="contact-item">✉ ${personal.email}</span>`     : ''}
    ${personal?.phone    ? `<span class="contact-item">📞 ${personal.phone}</span>`    : ''}
    ${personal?.location ? `<span class="contact-item">📍 ${personal.location}</span>` : ''}
  </div>
  <div class="socials">
    ${socials?.github    ? `<a href="${socials.github}"    class="social-link" target="_blank">GitHub</a>`    : ''}
    ${socials?.linkedin  ? `<a href="${socials.linkedin}"  class="social-link" target="_blank">LinkedIn</a>`  : ''}
    ${socials?.twitter   ? `<a href="${socials.twitter}"   class="social-link" target="_blank">Twitter</a>`   : ''}
    ${socials?.website   ? `<a href="${socials.website}"   class="social-link" target="_blank">Website</a>`   : ''}
    ${socials?.instagram ? `<a href="${socials.instagram}" class="social-link" target="_blank">Instagram</a>` : ''}
  </div>
</section>`

  const t1 = () => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${personal?.name || 'Portfolio'}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#010b18;color:#e8f8ff;font-family:'Inter',sans-serif}
nav{position:fixed;top:0;left:0;right:0;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;background:rgba(1,11,24,0.85);backdrop-filter:blur(12px);z-index:100}
.nav-brand{color:#00ffe7;font-weight:700;font-size:1.1rem}
.nav-links{display:flex;gap:1.5rem}
.nav-links a{color:#a0c4d8;text-decoration:none;font-size:.9rem}
.nav-links a:hover{color:#00ffe7}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;background:radial-gradient(ellipse at center,#032340 0%,#010b18 70%)}
.avatar{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid #00ffe7;margin:0 auto 1.5rem;display:block;box-shadow:0 0 30px rgba(0,255,231,0.3)}
.avatar-placeholder{width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#032340,#0e6eb8);border:3px solid #00ffe7;margin:0 auto 1.5rem;display:flex;align-items:center;justify-content:center;font-size:2.5rem;box-shadow:0 0 30px rgba(0,255,231,0.3)}
h1{font-size:clamp(2.5rem,6vw,4rem);font-weight:700;background:linear-gradient(180deg,#e8f8ff,#00ffe7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:.5rem}
.subtitle{color:#7dd4f8;font-size:1.1rem;margin-bottom:1rem;font-weight:500}
.bio{color:#a0c4d8;max-width:600px;margin:0 auto 2rem;line-height:1.7;font-size:.95rem}
.socials{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1rem}
.social-link{padding:.5rem 1.2rem;border-radius:50px;font-size:.82rem;font-weight:500;border:1px solid rgba(0,255,231,0.2);color:#7dd4f8;text-decoration:none;transition:all .3s;background:rgba(14,110,184,0.1)}
.social-link:hover{border-color:#00ffe7;color:#00ffe7}
section{padding:5rem 2rem;max-width:900px;margin:0 auto}
.section-title{font-size:1.8rem;font-weight:700;color:#e8f8ff;margin-bottom:.5rem}
.section-sub{color:#00ffe7;font-size:.8rem;text-transform:uppercase;letter-spacing:.15em;margin-bottom:.5rem;font-family:monospace}
.skills-label{color:#7dd4f8;font-size:.85rem;margin-bottom:.8rem;font-family:monospace}
.skills-grid{display:flex;flex-wrap:wrap;gap:.6rem}
.mb{margin-bottom:1.5rem}
.skill-tag{padding:.4rem 1rem;border-radius:50px;font-size:.82rem;font-weight:500;background:rgba(14,110,184,0.2);border:1px solid rgba(0,255,231,0.2);color:#7dd4f8}
.project-card{background:rgba(3,35,64,0.4);border:1px solid rgba(0,255,231,0.1);border-radius:16px;padding:1.5rem;margin-bottom:1.2rem;transition:border-color .3s,transform .3s}
.project-card:hover{border-color:rgba(0,255,231,0.4);transform:translateY(-4px)}
.project-title{font-size:1.1rem;font-weight:600;color:#e8f8ff;margin-bottom:.4rem}
.project-desc{color:#a0c4d8;font-size:.88rem;line-height:1.6;margin-bottom:.8rem}
.project-tech{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.8rem}
.tech-tag{padding:.2rem .7rem;border-radius:50px;font-size:.75rem;background:rgba(0,255,231,0.1);border:1px solid rgba(0,255,231,0.2);color:#00ffe7}
.project-link{color:#00ffe7;text-decoration:none;font-size:.85rem;font-weight:500}
.edu-card{background:rgba(3,35,64,0.4);border:1px solid rgba(0,255,231,0.1);border-radius:16px;padding:1.5rem;margin-bottom:1rem}
.edu-degree{font-size:1.05rem;font-weight:600;color:#e8f8ff;margin-bottom:.3rem}
.edu-school{color:#7dd4f8;font-size:.9rem;margin-bottom:.2rem}
.edu-meta{color:#a0c4d8;font-size:.82rem}
.contact-info{display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;margin-bottom:1rem}
.contact-item{color:#a0c4d8;font-size:.85rem}
footer{text-align:center;padding:2rem;color:#3a6b8a;font-size:.8rem;border-top:1px solid rgba(0,255,231,0.08)}
</style></head><body>
<nav><span class="nav-brand">✦ ${personal?.name || 'Portfolio'}</span>
<div class="nav-links"><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#education">Education</a><a href="#contact">Contact</a></div></nav>
<div class="hero"><div>${avatarHtml}
<h1>${personal?.name || 'Your Name'}</h1>
<p class="subtitle">${personal?.title || 'Developer & Creator'}</p>
<p class="bio">${personal?.bio || 'Welcome to my portfolio.'}</p>
</div></div>
${skillsSection()}${projectsSection()}${educationSection()}${contactSection()}
<footer>Built with Portify · ${personal?.name || ''} © ${new Date().getFullYear()}</footer>
</body></html>`

  const t2 = () => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${personal?.name || 'Portfolio'}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d0d0d;color:#f0f0f0;font-family:'Poppins',sans-serif}
nav{position:fixed;top:0;left:0;right:0;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;background:rgba(13,13,13,0.9);backdrop-filter:blur(12px);z-index:100;border-bottom:1px solid rgba(255,107,107,0.15)}
.nav-brand{color:#ff6b6b;font-weight:700}
.nav-links a{color:#aaa;text-decoration:none;margin-left:1.5rem;font-size:.9rem}
.nav-links a:hover{color:#ff6b6b}
.hero{min-height:100vh;display:flex;align-items:center;padding:2rem 4rem;background:linear-gradient(135deg,#1a0a0a 0%,#0d0d0d 60%)}
.hero-content{max-width:600px}
.hero-tag{color:#ff6b6b;font-size:.85rem;text-transform:uppercase;letter-spacing:.2em;margin-bottom:1rem;font-weight:600}
h1{font-size:clamp(2.5rem,6vw,4.5rem);font-weight:800;line-height:1.1;margin-bottom:.8rem}
.accent{color:#ff6b6b}
.subtitle{color:#aaa;font-size:1.1rem;margin-bottom:1.5rem}
.bio{color:#888;line-height:1.8;margin-bottom:2rem;font-size:.95rem}
.socials{display:flex;gap:1rem;flex-wrap:wrap}
.social-link{padding:.5rem 1.2rem;border-radius:6px;font-size:.82rem;font-weight:600;border:1px solid rgba(255,107,107,0.3);color:#ff6b6b;text-decoration:none;transition:all .3s}
.social-link:hover{background:#ff6b6b;color:#0d0d0d}
.avatar{width:250px;height:250px;border-radius:20px;object-fit:cover;border:3px solid rgba(255,107,107,0.3);margin-left:auto}
.avatar-placeholder{width:200px;height:200px;border-radius:20px;background:linear-gradient(135deg,#1a0a0a,#3d1515);border:3px solid rgba(255,107,107,0.3);display:flex;align-items:center;justify-content:center;font-size:4rem;margin-left:auto}
section{padding:5rem 4rem;max-width:1000px;margin:0 auto}
.section-title{font-size:2rem;font-weight:700;margin-bottom:.5rem}
.section-sub{color:#ff6b6b;font-size:.8rem;text-transform:uppercase;letter-spacing:.15em;margin-bottom:.5rem;font-family:monospace}
.skills-label{color:#888;font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.8rem}
.skills-grid{display:flex;flex-wrap:wrap;gap:.6rem}
.mb{margin-bottom:1.5rem}
.skill-tag{padding:.4rem 1rem;border-radius:6px;font-size:.82rem;font-weight:500;background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.2);color:#ff9999}
.project-card{background:#161616;border:1px solid #222;border-radius:12px;padding:1.5rem;margin-bottom:1.2rem;transition:all .3s;border-left:3px solid #ff6b6b}
.project-card:hover{border-color:#ff6b6b;transform:translateX(4px)}
.project-title{font-size:1.1rem;font-weight:600;margin-bottom:.4rem}
.project-desc{color:#888;font-size:.88rem;line-height:1.6;margin-bottom:.8rem}
.project-tech{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.8rem}
.tech-tag{padding:.2rem .7rem;border-radius:4px;font-size:.75rem;background:rgba(255,107,107,0.1);color:#ff6b6b}
.project-link{color:#ff6b6b;text-decoration:none;font-size:.85rem;font-weight:600}
.edu-card{background:#161616;border:1px solid #222;border-radius:12px;padding:1.5rem;margin-bottom:1rem}
.edu-degree{font-size:1.05rem;font-weight:600;margin-bottom:.3rem}
.edu-school{color:#ff9999;font-size:.9rem}
.edu-meta{color:#888;font-size:.82rem}
.contact-info{display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.5rem}
.contact-item{color:#aaa;font-size:.9rem}
footer{text-align:center;padding:2rem;color:#444;font-size:.8rem;border-top:1px solid #1a1a1a}
</style></head><body>
<nav><span class="nav-brand">${personal?.name || 'Portfolio'}</span>
<div class="nav-links"><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#education">Education</a><a href="#contact">Contact</a></div></nav>
<div class="hero">
<div class="hero-content">
<p class="hero-tag">👋 Hello, I'm</p>
<h1>${personal?.name?.split(' ')[0] || 'Your'} <span class="accent">${personal?.name?.split(' ').slice(1).join(' ') || 'Name'}</span></h1>
<p class="subtitle">${personal?.title || 'Developer & Creator'}</p>
<p class="bio">${personal?.bio || 'Welcome to my portfolio.'}</p>
<div class="socials">
${socials?.github   ? `<a href="${socials.github}"   class="social-link" target="_blank">GitHub</a>`   : ''}
${socials?.linkedin ? `<a href="${socials.linkedin}" class="social-link" target="_blank">LinkedIn</a>` : ''}
${socials?.twitter  ? `<a href="${socials.twitter}"  class="social-link" target="_blank">Twitter</a>`  : ''}
${socials?.website  ? `<a href="${socials.website}"  class="social-link" target="_blank">Website</a>`  : ''}
</div></div>
${personal?.photo ? `<img src="${personal.photo}" class="avatar" alt="${personal.name}"/>` : `<div class="avatar-placeholder">${personal?.name?.charAt(0) || '?'}</div>`}
</div>
${skillsSection()}${projectsSection()}${educationSection()}${contactSection()}
<footer>Built with Portify · ${personal?.name || ''} © ${new Date().getFullYear()}</footer>
</body></html>`

  const t3 = () => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${personal?.name || 'Portfolio'}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a1a0f;color:#e8f5e9;font-family:'DM Sans',sans-serif}
nav{position:fixed;top:0;left:0;right:0;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;background:rgba(10,26,15,0.9);backdrop-filter:blur(12px);z-index:100;border-bottom:1px solid rgba(116,198,157,0.15)}
.nav-brand{color:#74c69d;font-weight:700}
.nav-links a{color:#a5c9b1;text-decoration:none;margin-left:1.5rem;font-size:.9rem}
.nav-links a:hover{color:#74c69d}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem;background:radial-gradient(ellipse,#0d2a18 0%,#0a1a0f 70%)}
.avatar{width:130px;height:130px;border-radius:50%;object-fit:cover;border:3px solid #74c69d;margin:0 auto 1.5rem;display:block}
.avatar-placeholder{width:130px;height:130px;border-radius:50%;background:linear-gradient(135deg,#0d2a18,#1b5e35);border:3px solid #74c69d;margin:0 auto 1.5rem;display:flex;align-items:center;justify-content:center;font-size:2.5rem}
h1{font-size:clamp(2.5rem,6vw,4rem);font-weight:700;color:#e8f5e9;margin-bottom:.5rem}
.subtitle{color:#74c69d;font-size:1rem;margin-bottom:1rem;font-weight:500;text-transform:uppercase;letter-spacing:.1em}
.bio{color:#a5c9b1;max-width:580px;margin:0 auto 2rem;line-height:1.8}
.socials{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.social-link{padding:.5rem 1.2rem;border-radius:8px;font-size:.82rem;border:1px solid rgba(116,198,157,0.3);color:#74c69d;text-decoration:none;transition:all .3s}
.social-link:hover{background:rgba(116,198,157,0.1)}
section{padding:5rem 2rem;max-width:900px;margin:0 auto}
.section-title{font-size:1.8rem;font-weight:700;color:#e8f5e9;margin-bottom:.5rem}
.section-sub{color:#74c69d;font-size:.8rem;text-transform:uppercase;letter-spacing:.15em;margin-bottom:.5rem;font-family:monospace}
.skills-label{color:#74c69d;font-size:.8rem;text-transform:uppercase;margin-bottom:.8rem;letter-spacing:.1em}
.skills-grid{display:flex;flex-wrap:wrap;gap:.6rem}
.mb{margin-bottom:1.5rem}
.skill-tag{padding:.4rem 1rem;border-radius:50px;font-size:.82rem;background:rgba(116,198,157,0.1);border:1px solid rgba(116,198,157,0.25);color:#a5d6b7}
.project-card{background:rgba(13,42,24,0.5);border:1px solid rgba(116,198,157,0.12);border-radius:14px;padding:1.5rem;margin-bottom:1.2rem;transition:all .3s}
.project-card:hover{border-color:rgba(116,198,157,0.4);transform:translateY(-4px)}
.project-title{font-size:1.1rem;font-weight:600;color:#e8f5e9;margin-bottom:.4rem}
.project-desc{color:#a5c9b1;font-size:.88rem;line-height:1.6;margin-bottom:.8rem}
.project-tech{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.8rem}
.tech-tag{padding:.2rem .7rem;border-radius:50px;font-size:.75rem;background:rgba(116,198,157,0.1);color:#74c69d}
.project-link{color:#74c69d;text-decoration:none;font-size:.85rem;font-weight:500}
.edu-card{background:rgba(13,42,24,0.5);border:1px solid rgba(116,198,157,0.12);border-radius:14px;padding:1.5rem;margin-bottom:1rem}
.edu-degree{font-size:1.05rem;font-weight:600;color:#e8f5e9;margin-bottom:.3rem}
.edu-school{color:#74c69d;font-size:.9rem}
.edu-meta{color:#a5c9b1;font-size:.82rem}
.contact-info{display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;margin-bottom:1rem}
.contact-item{color:#a5c9b1;font-size:.85rem}
footer{text-align:center;padding:2rem;color:#2d5a3d;font-size:.8rem;border-top:1px solid rgba(116,198,157,0.08)}
</style></head><body>
<nav><span class="nav-brand">◈ ${personal?.name || 'Portfolio'}</span>
<div class="nav-links"><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#education">Education</a><a href="#contact">Contact</a></div></nav>
<div class="hero"><div>${avatarHtml}
<h1>${personal?.name || 'Your Name'}</h1>
<p class="subtitle">${personal?.title || 'Developer & Creator'}</p>
<p class="bio">${personal?.bio || 'Welcome to my portfolio.'}</p>
<div class="socials">
${socials?.github   ? `<a href="${socials.github}"   class="social-link" target="_blank">GitHub</a>`   : ''}
${socials?.linkedin ? `<a href="${socials.linkedin}" class="social-link" target="_blank">LinkedIn</a>` : ''}
${socials?.twitter  ? `<a href="${socials.twitter}"  class="social-link" target="_blank">Twitter</a>`  : ''}
${socials?.website  ? `<a href="${socials.website}"  class="social-link" target="_blank">Website</a>`  : ''}
</div></div></div>
${skillsSection()}${projectsSection()}${educationSection()}${contactSection()}
<footer>Built with Portify · ${personal?.name || ''} © ${new Date().getFullYear()}</footer>
</body></html>`

  const map = { 1: t1, 2: t2, 3: t3 }
  const pick = ((templateId - 1) % 3) + 1
  return (map[pick] || t1)()
}

export default function Preview() {
  const navigate = useNavigate()

  const [data, setData]                 = useState(null)
  const [templateId, setTemplateId]     = useState(1)
  const [html, setHtml]                 = useState('')
  const [loading, setLoading]           = useState(true)
  const [activeTab, setActiveTab]       = useState('preview')
  const [publishing, setPublishing]     = useState(false)
  const [publishedUrl, setPublishedUrl] = useState(null)
  const [publishError, setPublishError] = useState('')
  const [copied, setCopied]             = useState(false)
  const [portfolioId, setPortfolioId]   = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('portify_data')
    const tplId  = parseInt(localStorage.getItem('portify_template') || '1')
    const pid    = localStorage.getItem('portify_portfolio_id')
    if (!stored) { navigate('/builder'); return }
    const parsed = JSON.parse(stored)
    setData(parsed)
    setTemplateId(tplId)
    setHtml(renderTemplate(parsed, tplId))
    if (pid) setPortfolioId(pid)
    setTimeout(() => setLoading(false), 800)
  }, [])

  const switchTemplate = (id) => {
    setTemplateId(id)
    setHtml(renderTemplate(data, id))
    localStorage.setItem('portify_template', String(id))
    setPublishedUrl(null)
    setPublishError('')
  }

  const downloadHTML = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${data?.personal?.name || 'portfolio'}-portify.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePublish = async () => {
    if (!portfolioId) {
      setPublishError('Please log in and generate your portfolio first.')
      return
    }
    setPublishing(true)
    setPublishError('')
    try {
      const deployUrl = `${window.location.origin}/portfolio/${portfolioId}`
      const res = await api.patch(`/api/portfolios/${portfolioId}/deploy`, { deployUrl })
      setPublishedUrl(res.data.publicUrl)
    } catch (err) {
      setPublishError(err.response?.data?.message || 'Failed to publish. Try again.')
    } finally {
      setPublishing(false)
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(publishedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const templateOptions = [
    { id: 1, name: 'Deep Ocean',     color: '#00ffe7' },
    { id: 2, name: 'Midnight Coral', color: '#ff6b6b' },
    { id: 3, name: 'Forest Depth',   color: '#74c69d' },
    { id: 4, name: 'Neon Void',      color: '#f72585' },
    { id: 5, name: 'Arctic Mist',    color: '#a8dadc' },
    { id: 6, name: 'Solar Flare',    color: '#f4a261' },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: '#010b18' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-2 border-ocean-700 border-t-biolum-DEFAULT
                        rounded-full animate-spin" />
        <p className="font-mono text-sm text-biolum-DEFAULT tracking-widest uppercase animate-pulse">
          Generating your portfolio...
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#010b18' }}>

      <div className="glass-dark border-b border-ocean-700/30 px-6 py-3
                      flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="font-bold text-biolum-DEFAULT text-sm">✦ Portify</span>
          <span className="text-ocean-600">|</span>
          <span className="font-mono text-xs text-ocean-300 tracking-wider uppercase">
            Portfolio Preview
          </span>
          <span className="font-mono text-xs text-biolum-DEFAULT">
            Template #{templateId}
          </span>
        </div>

        <div className="flex items-center gap-1 glass rounded-full p-1">
          {['preview', 'templates'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full font-mono text-xs
                                tracking-wider uppercase transition-all duration-300
                                ${activeTab === tab
                                  ? 'bg-biolum-DEFAULT text-ocean-950 font-bold'
                                  : 'text-ocean-300 hover:text-foam-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => navigate('/builder')}
                  className="btn-outline-ocean px-4 py-2 text-xs font-mono">
            ← Edit
          </button>
          <button onClick={downloadHTML}
                  className="btn-outline-ocean px-4 py-2 text-xs font-mono">
            ↓ Download
          </button>
          <button onClick={handlePublish} disabled={publishing}
                  className="btn-ocean px-4 py-2 text-xs font-mono
                             flex items-center gap-1.5 disabled:opacity-60">
            {publishing ? (
              <>
                <span className="w-3 h-3 border border-ocean-950/30
                                 border-t-ocean-950 rounded-full animate-spin" />
                Publishing...
              </>
            ) : '🚀 Publish & Get URL'}
          </button>
        </div>
      </div>

      {publishedUrl && (
        <div className="px-6 py-3 flex items-center gap-3 flex-wrap
                        border-b border-green-500/20"
             style={{ background: 'rgba(34,197,94,0.08)' }}>
          <span className="text-green-400 text-sm">🎉 Live at:</span>
          <a href={publishedUrl} target="_blank" rel="noreferrer"
             className="font-mono text-sm text-green-400 underline">
            {publishedUrl}
          </a>
          <button onClick={copyUrl}
                  className="px-3 py-1 rounded-lg text-xs font-mono
                             border border-green-500/30 text-green-400
                             hover:bg-green-500/10 transition-all">
            {copied ? '✓ Copied!' : 'Copy URL'}
          </button>
        </div>
      )}

      {publishError && (
        <div className="px-6 py-2 text-xs font-mono text-red-400
                        border-b border-red-500/20"
             style={{ background: 'rgba(239,68,68,0.08)' }}>
          ⚠ {publishError}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="glass-dark border-b border-ocean-700/30 px-6 py-4">
          <p className="font-mono text-xs text-ocean-400 tracking-wider uppercase mb-3">
            Switch Template
          </p>
          <div className="flex gap-3 flex-wrap">
            {templateOptions.map((t) => (
              <button key={t.id} onClick={() => switchTemplate(t.id)}
                      className={`px-4 py-2 rounded-full text-xs font-mono
                                  border transition-all duration-300
                                  ${templateId === t.id ? 'scale-105' : 'glass hover:scale-105'}`}
                      style={{
                        borderColor: t.color,
                        color: templateId === t.id ? '#010b18' : t.color,
                        background: templateId === t.id ? t.color : '',
                      }}>
                {templateId === t.id && '✓ '}{t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1">
        <iframe
          srcDoc={html}
          title="Portfolio Preview"
          className="w-full border-none"
          style={{ height: 'calc(100vh - 60px)' }}
        />
      </div>

    </div>
  )
}