const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  loginAdmin,
  getAdminProfile,
  createDefaultAdmin,
  getAllAdmins
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Rate limiting for admin login
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later'
  }
});

// Validation middleware
const validateLogin = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Routes
router.post('/login', loginLimit, validateLogin, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  loginAdmin(req, res);
});

router.get('/profile', authMiddleware, getAdminProfile);
router.get('/all', authMiddleware, getAllAdmins);
router.post('/create-default', createDefaultAdmin);

module.exports = router;
