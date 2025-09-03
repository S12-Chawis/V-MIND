const { pool } = require('../config/database');

// Obtener todas las notas del usuario
const getUserNotes = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const query = `
      SELECT note_id, title, content, created_at, updated_at
      FROM notes 
      WHERE user_id = ?
      ORDER BY updated_at DESC, created_at DESC
    `;
    
    const [notes] = await pool.execute(query, [userId]);
    
    res.json({
      success: true,
      data: notes
    });

  } catch (error) {
    console.error('Get user notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user notes',
      error: error.message
    });
  }
};

// Crear una nueva nota
const createNote = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    const query = `
      INSERT INTO notes (user_id, title, content, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await pool.execute(query, [userId, title, content]);
    
    // Si hay tags, guardarlos (aquí podrías implementar una tabla de tags si quieres)
    // Por ahora solo guardamos la nota básica
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: {
        note_id: result.insertId,
        title,
        content,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating note',
      error: error.message
    });
  }
};

// Actualizar una nota existente
const updateNote = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { noteId } = req.params;
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    // Verificar que la nota pertenece al usuario
    const checkQuery = `
      SELECT note_id FROM notes 
      WHERE note_id = ? AND user_id = ?
    `;
    
    const [existingNotes] = await pool.execute(checkQuery, [noteId, userId]);
    
    if (existingNotes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or access denied'
      });
    }
    
    const updateQuery = `
      UPDATE notes 
      SET title = ?, content = ?, updated_at = NOW()
      WHERE note_id = ? AND user_id = ?
    `;
    
    await pool.execute(updateQuery, [title, content, noteId, userId]);
    
    res.json({
      success: true,
      message: 'Note updated successfully'
    });

  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating note',
      error: error.message
    });
  }
};

// Eliminar una nota
const deleteNote = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { noteId } = req.params;
    
    // Verificar que la nota pertenece al usuario
    const checkQuery = `
      SELECT note_id FROM notes 
      WHERE note_id = ? AND user_id = ?
    `;
    
    const [existingNotes] = await pool.execute(checkQuery, [noteId, userId]);
    
    if (existingNotes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or access denied'
      });
    }
    
    const deleteQuery = `
      DELETE FROM notes 
      WHERE note_id = ? AND user_id = ?
    `;
    
    await pool.execute(deleteQuery, [noteId, userId]);
    
    res.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting note',
      error: error.message
    });
  }
};

module.exports = {
  getUserNotes,
  createNote,
  updateNote,
  deleteNote
};
