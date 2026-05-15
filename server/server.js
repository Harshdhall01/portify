// server.js
const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
const dotenv   = require('dotenv')

dotenv.config()

const app = express()

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))
app.use(express.json({ limit: '5mb' })) // increased for HTML storage

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/authRoutes'))
app.use('/api/portfolios', require('./routes/portfolioRoutes'))
app.use('/api/publish',    require('./routes/publishRoutes'))

// ── Public portfolio pages (served as raw HTML) ───────────────
app.use('/u', require('./routes/publishRoutes'))

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Portify API is running 🚀' })
})

// ── Connect MongoDB + Start server ────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })