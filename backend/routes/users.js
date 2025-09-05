const express = require('express');
const router = express.Router();
const {
  getUserInterests,
  updateUserInterest,
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
  getUserResources,
  saveResource,
  getUserStats,
  deleteAccount
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Interests
router.get('/interests', auth, getUserInterests);
router.put('/interests', auth, updateUserInterest);

// Notes
router.get('/notes', auth, getUserNotes);
router.post('/notes', auth, createNote);
router.put('/notes/:noteId', auth, updateNote);
router.delete('/notes/:noteId', auth, deleteNote);

// Resources
router.get('/resources', auth, getUserResources);
router.post('/resources', auth, saveResource);

// Stats
router.get('/stats', auth, getUserStats);

// Account management
router.delete('/delete-account', auth, deleteAccount);

module.exports = router;
