const express = require('express');
const router = express.Router();
const {
  getUserNotes,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');
const { auth } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Obtener todas las notas del usuario
router.get('/user', getUserNotes);

// Crear una nueva nota
router.post('/', createNote);

// Actualizar una nota existente
router.put('/:noteId', updateNote);

// Eliminar una nota
router.delete('/:noteId', deleteNote);

module.exports = router;
