const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly, verifiedExpertOnly } = require('../middleware/authMiddleware');
const {
  getAllIdeasForReview,
  getExpertProfile,
  createOrUpdateExpertProfile,
  submitExpertReview,
  getMyReviews,
  getAllExperts,
  getVerificationStatus,
  getPendingExperts
} = require('../controllers/expertController');

// Expert-only routes
router.get('/ideas', authMiddleware, verifiedExpertOnly, getAllIdeasForReview);
router.get('/profile', authMiddleware, getExpertProfile);
router.post('/profile', authMiddleware, createOrUpdateExpertProfile);
router.put('/profile', authMiddleware, createOrUpdateExpertProfile);
router.post('/ideas/:ideaId/review', authMiddleware, verifiedExpertOnly, submitExpertReview);
router.get('/my-reviews', authMiddleware, verifiedExpertOnly, getMyReviews);
router.get('/verification-status', authMiddleware, getVerificationStatus);

// Admin routes for expert management
router.get('/all', authMiddleware, adminOnly, getAllExperts);
router.get('/pending', authMiddleware, adminOnly, getPendingExperts);

module.exports = router;
