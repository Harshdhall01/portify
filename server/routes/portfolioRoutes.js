// routes/portfolioRoutes.js
const express    = require('express')
const router     = express.Router()
const Portfolio  = require('../models/Portfolio')
const { protect } = require('../middleware/auth')
const { enhancePortfolio } = require('../services/grokService')

// @route   POST /api/portfolios/generate
// @desc    AI-enhance data + pick template, then save portfolio
// @access  Private
router.post('/generate', protect, async (req, res) => {
  const { personal, skills, projects, education, socials, lastTemplateId } = req.body

  try {
    const formData = { personal, skills, projects, education, socials }

    // Run Grok AI (falls back to random if API limit hit)
    const result = await enhancePortfolio(formData, lastTemplateId || 0)

    // Save to DB
    const portfolio = await Portfolio.create({
      userId:     req.user._id,
      formData:   result.formData,
      templateId: result.templateId,
      aiEnhanced: result.aiEnhanced,
      status:     'draft',
    })

    res.status(201).json({
      portfolio,
      templateId:   result.templateId,
      designReason: result.designReason,
      aiEnhanced:   result.aiEnhanced,
      fallbackReason: result.fallbackReason || null,
    })

  } catch (error) {
    console.error('Generate portfolio error:', error.message)
    res.status(500).json({ message: 'Server error while generating portfolio' })
  }
})

// @route   POST /api/portfolios/save
// @desc    Save portfolio directly (no AI, from Builder)
// @access  Private
router.post('/save', protect, async (req, res) => {
  const { personal, skills, projects, education, socials, templateId } = req.body

  try {
    // Check if editing existing portfolio
    const editingId = req.body.editingId

    if (editingId) {
      const updated = await Portfolio.findOneAndUpdate(
        { _id: editingId, userId: req.user._id },
        { formData: { personal, skills, projects, education, socials }, templateId, updatedAt: new Date() },
        { new: true }
      )
      if (!updated) return res.status(404).json({ message: 'Portfolio not found' })
      return res.json({ portfolio: updated })
    }

    const portfolio = await Portfolio.create({
      userId:     req.user._id,
      formData:   { personal, skills, projects, education, socials },
      templateId: templateId || 1,
      status:     'draft',
    })

    res.status(201).json({ portfolio })

  } catch (error) {
    console.error('Save portfolio error:', error.message)
    res.status(500).json({ message: 'Server error while saving portfolio' })
  }
})

// @route   GET /api/portfolios/my
// @desc    Get all portfolios for logged-in user
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json({ portfolios })
  } catch (error) {
    console.error('Fetch portfolios error:', error.message)
    res.status(500).json({ message: 'Server error while fetching portfolios' })
  }
})

// @route   GET /api/portfolios/:id
// @desc    Get a single portfolio by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id })
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' })
    res.json({ portfolio })
  } catch (error) {
    console.error('Fetch portfolio error:', error.message)
    res.status(500).json({ message: 'Server error while fetching portfolio' })
  }
})

// @route   DELETE /api/portfolios/:id
// @desc    Delete a portfolio
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id })
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' })
    await portfolio.deleteOne()
    res.json({ message: 'Portfolio deleted successfully' })
  } catch (error) {
    console.error('Delete portfolio error:', error.message)
    res.status(500).json({ message: 'Server error while deleting portfolio' })
  }
})

// @route   PATCH /api/portfolios/:id/deploy
// @desc    Mark portfolio as live with deploy URL
// @access  Private
router.patch('/:id/deploy', protect, async (req, res) => {
  const { deployUrl } = req.body
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { deployUrl, status: 'live', updatedAt: new Date() },
      { new: true }
    )
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' })
    res.json({ portfolio })
  } catch (error) {
    console.error('Deploy update error:', error.message)
    res.status(500).json({ message: 'Server error while updating deploy URL' })
  }
})

module.exports = router