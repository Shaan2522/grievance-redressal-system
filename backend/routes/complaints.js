const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  submitComplaint,
  trackComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintById,
  getComplaintPhoto
} = require('../controllers/complaintController');
const authMiddleware = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Rate limiting for complaint submission
const submitLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    success: false,
    message: 'Too many complaints submitted, please try again later'
  }
});

// Rate limiting for tracking (prevent abuse)
const trackLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // allow more requests for tracking
  message: {
    success: false,
    message: 'Too many tracking requests, please try again later'
  }
});

// Validation middleware
const validateComplaint = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('ward').notEmpty().withMessage('Ward is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('complaintType').trim().isLength({ min: 3 }).withMessage('Complaint type must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level')
];

// Validation middleware for status update
const validateStatusUpdate = [
  body('status').isIn(['received', 'in_progress', 'resolved']).withMessage('Invalid status'),
  body('message').optional().trim().isLength({ min: 1 }).withMessage('Message cannot be empty')
];

// PUBLIC ROUTES (No authentication required)
router.post('/submit', submitLimit, upload.single('photo'), validateComplaint, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  submitComplaint(req, res);
});

// Track complaint route (public)
router.get('/track/:ticketId', trackLimit, trackComplaint);

// Get complaint photo (public)
router.get('/photo/:ticketId', getComplaintPhoto);

// PROTECTED ROUTES (Admin authentication required)
router.get('/', authMiddleware, getAllComplaints);
router.get('/:id', authMiddleware, getComplaintById);
router.put('/:id/status', authMiddleware, validateStatusUpdate, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  updateComplaintStatus(req, res);
});

module.exports = router;
