const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Helper — generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  try {
    // Check all fields present
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Create new user (password gets hashed by pre-save hook in model)
    const user = await User.create({ name, email, password })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })

  } catch (error) {
    console.error('Register error:', error.message)
    res.status(500).json({ message: 'Server error during registration' })
  }
})

// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Check all fields present
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })

  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ message: 'Server error during login' })
  }
})

module.exports = router