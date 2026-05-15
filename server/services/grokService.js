// services/grokService.js
// Grok AI integration for portfolio enhancement + smart template picking

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'
const TOTAL_TEMPLATES = 24

// ── Random fallback picker (avoids repeating last template) ──
const randomTemplate = (lastId = 0) => {
  let picked
  do {
    picked = Math.floor(Math.random() * TOTAL_TEMPLATES) + 1
  } while (picked === lastId)
  return picked
}

// ── Call Grok API ─────────────────────────────────────────────
const callGrok = async (prompt) => {
  const response = await fetch(GROK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || `Grok API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}

// ── Main: enhance portfolio data + pick template ──────────────
const enhancePortfolio = async (formData, lastTemplateId = 0) => {
  const { personal, skills, projects, education, socials } = formData

  const prompt = `
You are a professional portfolio designer AI. A user has submitted their details to generate a portfolio website.

USER DATA:
- Name: ${personal.name || 'Not provided'}
- Title: ${personal.title || 'Not provided'}
- Bio: ${personal.bio || 'Not provided'}
- Technical Skills: ${skills.technical || 'Not provided'}
- Tools: ${skills.tools || 'Not provided'}
- Soft Skills: ${skills.soft || 'Not provided'}
- Projects: ${projects.filter(p => p.title).map(p => p.title).join(', ') || 'None'}
- Education: ${education.filter(e => e.degree).map(e => `${e.degree} at ${e.school}`).join(', ') || 'None'}

YOUR TASKS:
1. Write an improved, professional 2-3 sentence bio for this person (if bio is weak or missing).
2. Pick the best template number (1-${TOTAL_TEMPLATES}) based on their profile. 
   - Templates 1-6: Minimal/Clean (good for designers, writers)
   - Templates 7-12: Bold/Creative (good for developers, engineers)
   - Templates 13-18: Professional/Corporate (good for business, management)
   - Templates 19-24: Colorful/Artistic (good for artists, marketers)
   - Do NOT pick template #${lastTemplateId} (recently used).
3. Write improved 1-sentence descriptions for up to 3 projects (if descriptions are weak).

Respond ONLY in this exact JSON format, no extra text:
{
  "templateId": <number>,
  "enhancedBio": "<improved bio>",
  "enhancedProjects": [
    { "index": 0, "desc": "<improved description>" },
    { "index": 1, "desc": "<improved description>" }
  ],
  "designReason": "<one sentence why you picked this template>"
}
`

  try {
    const raw = await callGrok(prompt)

    // Strip markdown code fences if present
    const clean = raw.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    // Validate templateId range
    if (!result.templateId || result.templateId < 1 || result.templateId > TOTAL_TEMPLATES) {
      result.templateId = randomTemplate(lastTemplateId)
    }

    // Apply enhanced bio if original was weak (under 20 chars)
    if (result.enhancedBio && (!personal.bio || personal.bio.length < 20)) {
      formData.personal.bio = result.enhancedBio
    }

    // Apply enhanced project descriptions
    if (result.enhancedProjects && Array.isArray(result.enhancedProjects)) {
      result.enhancedProjects.forEach(({ index, desc }) => {
        if (formData.projects[index] && (!formData.projects[index].desc || formData.projects[index].desc.length < 20)) {
          formData.projects[index].desc = desc
        }
      })
    }

    return {
      formData,
      templateId: result.templateId,
      designReason: result.designReason || '',
      aiEnhanced: true,
    }

  } catch (err) {
    // ── Fallback: random template if Grok fails/rate limits ──
    console.warn('Grok fallback triggered:', err.message)
    return {
      formData,
      templateId: randomTemplate(lastTemplateId),
      designReason: '',
      aiEnhanced: false,
      fallbackReason: err.message,
    }
  }
}

module.exports = { enhancePortfolio, randomTemplate }