import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/users (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /api/users/:id (admin)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// PUT /api/users/:id/vip (assign VIP status)
router.put('/:id/vip', protect, authorize('admin'), async (req, res) => {
  const { specialClientCode } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.userType = 'vip_customer';
    user.specialClientCode = specialClientCode || user.specialClientCode;
    await user.save();
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      specialClientCode: user.specialClientCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to assign VIP status' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;

