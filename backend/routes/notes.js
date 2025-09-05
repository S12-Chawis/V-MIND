const express = require('express');
const router = express.Router();
const {
  getUserNotes,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');
const { auth } = require('../middleware/auth');

// all routes require authentication
router.use(auth);

// get all notes of the user
router.get('/user', getUserNotes);

// create a new note
router.post('/', createNote);

// update a note
router.put('/:noteId', updateNote);

// delete a note
router.delete('/:noteId', deleteNote);

module.exports = router;
