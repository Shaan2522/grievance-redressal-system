const express = require('express');
const router = express.Router();
const { 
  getDashboardAnalytics, 
  getTrends, 
  getDepartmentPerformance 
} = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

// All analytics routes require authentication
router.use(authMiddleware);

// Routes
router.get('/dashboard', getDashboardAnalytics);
router.get('/trends', getTrends);
router.get('/department-performance', getDepartmentPerformance);

module.exports = router;
