const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const { 
  getAllIdeas, 
  addFeedback, 
  getAllUsers, 
  updateUserRole, 
  deleteUser,
  deleteIdea,
  updateIdea,
  getSystemStats,
  verifyExpert,
  toggleExpertStatus,
  bulkDeleteIdeas,
  bulkUpdateUserRoles,
  getSystemHealth,
  getRecentActivity
} = require('../controllers/adminController');
const {
  getAllExperts,
  getPendingExperts
} = require('../controllers/expertController');

// Ideas management
router.get('/ideas', authMiddleware, adminOnly, getAllIdeas);
router.post('/ideas/:id/feedback', authMiddleware, adminOnly, addFeedback);
router.delete('/ideas/:id', authMiddleware, adminOnly, deleteIdea);
router.put('/ideas/:id', authMiddleware, adminOnly, updateIdea);

// User management
router.get('/users', authMiddleware, adminOnly, getAllUsers);
router.put('/users/:id/role', authMiddleware, adminOnly, updateUserRole);
router.delete('/users/:id', authMiddleware, adminOnly, deleteUser);

// Expert management
router.get('/experts', authMiddleware, adminOnly, getAllExperts);
router.get('/experts/pending', authMiddleware, adminOnly, getPendingExperts);
router.put('/experts/:id/verify', authMiddleware, adminOnly, verifyExpert);
router.put('/experts/:id/status', authMiddleware, adminOnly, toggleExpertStatus);

// Bulk operations
router.post('/ideas/bulk-delete', authMiddleware, adminOnly, bulkDeleteIdeas);
router.post('/users/bulk-update-roles', authMiddleware, adminOnly, bulkUpdateUserRoles);

// System monitoring and analytics
router.get('/stats', authMiddleware, adminOnly, getSystemStats);
router.get('/health', authMiddleware, adminOnly, getSystemHealth);
router.get('/activity', authMiddleware, adminOnly, getRecentActivity);

module.exports = router;
