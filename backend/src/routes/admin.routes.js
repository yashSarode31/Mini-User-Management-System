import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../middleware/auth.middleware.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = express.Router()

// =====================
// GET all users (admin)
// =====================
router.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find().select('-password')
      res.status(200).json(users)
    } catch (error) {
      console.error('GET USERS ERROR:', error)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// ===============================
// Activate / Deactivate user
// ===============================
router.patch(
  '/users/:id/status',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body

      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' })
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).select('-password')

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json(user)
    } catch (error) {
      console.error('UPDATE USER STATUS ERROR:', error)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

export default router
