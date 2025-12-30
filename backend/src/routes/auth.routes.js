import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

// ===================== SIGNUP =====================
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    await User.create({
      fullName,
      email,
      password,
    })

    return res.status(201).json({
      message: 'User registered successfully',
    })
  } catch (error) {
  res.status(500).json({ message: 'Server error' })
}
})

// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'User account is inactive' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    user.lastLogin = new Date()
    await user.save()

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('LOGIN ERROR:', error)
    return res.status(500).json({ message: 'Server error' })
  }
})

// ===================== ME =====================
router.get('/me', authMiddleware, async (req, res) => {
  return res.status(200).json(req.user)
})

export default router
