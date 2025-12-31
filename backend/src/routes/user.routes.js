import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

// =====================
// Update profile (me)
// =====================
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { fullName, email } = req.body

    if (!fullName && !email) {
      return res.status(400).json({ message: 'Nothing to update' })
    }

    if (email) {
      const existingUser = await User.findOne({ email })
      if (existingUser && String(existingUser._id) !== String(req.user._id)) {
        return res.status(400).json({ message: 'Email already registered' })
      }
    }

    const updates = {}
    if (fullName) updates.fullName = fullName
    if (email) updates.email = email

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password')

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error)
    return res.status(500).json({ message: 'Server error' })
  }
})

// =====================
// Change password (me)
// =====================
router.put('/me/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: 'currentPassword and newPassword are required' })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    return res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('CHANGE PASSWORD ERROR:', error)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
