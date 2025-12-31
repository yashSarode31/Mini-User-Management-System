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
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
      const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1)
      const skip = (page - 1) * limit

      const totalUsers = await User.countDocuments()
      const totalPages = Math.max(Math.ceil(totalUsers / limit), 1)

      const users = await User.find()
        .select('-password')
        .skip(skip)
        .limit(limit)

      return res.status(200).json({
        page,
        limit,
        totalUsers,
        totalPages,
        users,
      })
    } catch (error) {
      console.error('GET USERS ERROR:', error)
      return res.status(500).json({ message: 'Server error' })
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
