const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  createIdea,
  getUserIdeas,
  getIdeaById,
  exportIdeaPdf,
  updateIdea,
  deleteIdea
} = require('../controllers/ideaController');

router.post('/', authMiddleware, createIdea);
router.get('/', authMiddleware, getUserIdeas);
router.get('/:id', authMiddleware, getIdeaById);
router.put('/:id', authMiddleware, updateIdea);
router.delete('/:id', authMiddleware, deleteIdea);
router.get('/:id/export', authMiddleware, exportIdeaPdf);

module.exports = router;
