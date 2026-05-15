// routes/publishRoutes.js
const express   = require('express')
const router    = express.Router()
const Portfolio = require('../models/Portfolio')
const { protect } = require('../middleware/auth')

// ── Generate a unique slug from name ─────────────────────────
const generateSlug = (name) => {
  const base = (name || 'portfolio')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 30)
  const suffix = Math.random().toString(36).slice(2, 6) // e.g. "x7k2"
  return `${base}-${suffix}`
}

// @route   POST /api/publish/:portfolioId
// @desc    Publish portfolio — save HTML + generate public URL
// @access  Private
router.post('/:portfolioId', protect, async (req, res) => {
  const { html, templateId } = req.body

  try {
    if (!html) {
      return res.status(400).json({ message: 'No HTML provided' })
    }

    const portfolio = await Portfolio.findOne({
      _id: req.params.portfolioId,
      userId: req.user._id,
    })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    // Generate slug if not already published
    const slug = portfolio.slug || generateSlug(portfolio.formData?.personal?.name)

    // Save HTML + slug + mark as live
    portfolio.publishedHtml = html
    portfolio.slug          = slug
    portfolio.status        = 'live'
    portfolio.templateId    = templateId || portfolio.templateId
    portfolio.deployUrl     = `${process.env.BASE_URL}/u/${slug}`

    await portfolio.save()

    res.json({
      message:   'Portfolio published successfully!',
      publicUrl: portfolio.deployUrl,
      slug,
    })

  } catch (error) {
    console.error('Publish error:', error.message)
    res.status(500).json({ message: 'Server error while publishing' })
  }
})

// @route   GET /u/:slug
// @desc    Serve published portfolio as HTML page (public)
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug, status: 'live' })

    if (!portfolio || !portfolio.publishedHtml) {
      return res.status(404).send(`
        <!DOCTYPE html><html><head><title>Not Found</title></head>
        <body style="background:#010b18;color:#e8f8ff;font-family:sans-serif;
                     display:flex;align-items:center;justify-content:center;
                     min-height:100vh;text-align:center">
          <div>
            <h1 style="color:#00ffe7;font-size:3rem">404</h1>
            <p>Portfolio not found or not yet published.</p>
            <a href="${process.env.CLIENT_URL}" style="color:#00ffe7">← Back to Portify</a>
          </div>
        </body></html>
      `)
    }

    res.setHeader('Content-Type', 'text/html')
    res.send(portfolio.publishedHtml)

  } catch (error) {
    console.error('Serve portfolio error:', error.message)
    res.status(500).send('Server error')
  }
})

module.exports = router