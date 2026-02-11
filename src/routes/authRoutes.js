import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min length 6'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  validateRequest,
  async (req, res) => {

    const { email, password, name, phone, adminCode, specialClientCode } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      let userType = 'customer';
      if (adminCode && adminCode === (process.env.ADMIN_REG_CODE || 'ADMIN_CODE')) {
        userType = 'admin';
      }

      const user = await User.create({
        email,
        password,
        name,
        phone,
        userType,
        adminCode: userType === 'admin' ? adminCode : undefined,
        specialClientCode: specialClientCode || undefined,
      });

      const token = generateToken(user);

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          userType: user.userType,
          specialClientCode: user.specialClientCode,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        userType: user.userType,
        specialClientCode: user.specialClientCode,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/admin-login (requires admin code)
router.post('/admin-login', async (req, res) => {
  const { email, password, adminCode } = req.body;

  try {
    const user = await User.findOne({ email, userType: 'admin' });
    if (!user) {
      return res.status(400).json({ message: 'Admin not found or not admin' });
    }

    if (adminCode !== (process.env.ADMIN_LOGIN_CODE || process.env.ADMIN_REG_CODE || 'ADMIN_CODE')) {
      return res.status(401).json({ message: 'Invalid admin code' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// POST /api/auth/logout (client should just delete token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    phone: req.user.phone,
    userType: req.user.userType,
    specialClientCode: req.user.specialClientCode,
  });
});

export default router;

