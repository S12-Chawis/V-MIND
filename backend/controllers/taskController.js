const Task = require('../models/Task');
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getTasksByLevel = async (req, res) => {
  try {
    const { levelId } = req.params;
    const tasks = await Task.getTasksByLevel(levelId);

    res.json({
      success: true,
      data: tasks
    });

  } catch (error) {
    console.error('Get tasks by level error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting tasks',
      error: error.message
    });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const userTasks = await Task.getUserTasks(userId);

    res.json({
      success: true,
      data: userTasks
    });

  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user tasks',
      error: error.message
    });
  }
};

const completeTask = async (req, res) => {
  try {
    const { userTaskId } = req.params;
    const userId = req.user.user_id;

    const success = await Task.completeUserTask(userTaskId, userId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or already completed'
      });
    }

    res.json({
      success: true,
      message: 'Task completed successfully'
    });

  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing task',
      error: error.message
    });
  }
};

const assignTaskToUser = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.user_id;
    const userTaskId = uuidv4();

    const query = `
      INSERT INTO user_tasks (user_task_id, user_id, task_id, status)
      VALUES (?, ?, ?, 'pending')
      ON DUPLICATE KEY UPDATE status = 'pending'
    `;

    await pool.execute(query, [userTaskId, userId, taskId]);

    res.status(201).json({
      success: true,
      message: 'Task assigned successfully',
      data: { user_task_id: userTaskId }
    });

  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning task',
      error: error.message
    });
  }
};

const getTaskProgress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const query = `
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN ut.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN ut.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN ut.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
        SUM(CASE WHEN ut.status = 'completed' THEN t.xp_reward ELSE 0 END) as total_xp
      FROM user_tasks ut
      JOIN tasks t ON ut.task_id = t.task_id
      WHERE ut.user_id = ?
    `;

    const [rows] = await pool.execute(query, [userId]);
    const progress = rows[0];

    res.json({
      success: true,
      data: {
        total_tasks: parseInt(progress.total_tasks),
        completed_tasks: parseInt(progress.completed_tasks),
        in_progress_tasks: parseInt(progress.in_progress_tasks),
        pending_tasks: parseInt(progress.pending_tasks),
        total_xp: parseInt(progress.total_xp),
        completion_percentage: progress.total_tasks > 0 
          ? Math.round((progress.completed_tasks / progress.total_tasks) * 100) 
          : 0
      }
    });

  } catch (error) {
    console.error('Get task progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting task progress',
      error: error.message
    });
  }
};

const updateUserTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;
    const userId = req.user.user_id;

    // Primero verificar si ya existe una entrada en user_tasks
    const checkQuery = `
      SELECT user_task_id FROM user_tasks 
      WHERE user_id = ? AND task_id = ?
    `;
    
    const [existingTasks] = await pool.execute(checkQuery, [userId, taskId]);
    
    if (existingTasks.length === 0) {
      // Crear nueva entrada en user_tasks
      const userTaskId = uuidv4();
      const insertQuery = `
        INSERT INTO user_tasks (user_task_id, user_id, task_id, status, date_completed)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const dateCompleted = status === 'completed' ? new Date() : null;
      await pool.execute(insertQuery, [userTaskId, userId, taskId, status, dateCompleted]);
    } else {
      // Actualizar entrada existente
      const updateQuery = `
        UPDATE user_tasks 
        SET status = ?, date_completed = ?
        WHERE user_id = ? AND task_id = ?
      `;
      
      const dateCompleted = status === 'completed' ? new Date() : null;
      await pool.execute(updateQuery, [status, dateCompleted, userId, taskId]);
    }

    res.json({
      success: true,
      message: 'Task status updated successfully'
    });

  } catch (error) {
    console.error('Update user task status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task status',
      error: error.message
    });
  }
};

const getUserRoadmapTasks = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // Obtener todas las tareas con su estado para el usuario
    const query = `
      SELECT 
        t.task_id,
        t.title,
        t.description,
        t.type,
        t.xp_reward,
        l.title as level_title,
        l.roadmap_id,
        COALESCE(ut.status, 'pending') as user_status,
        ut.date_completed
      FROM tasks t
      LEFT JOIN levels l ON t.level_id = l.level_id
      LEFT JOIN user_tasks ut ON t.task_id = ut.task_id AND ut.user_id = ?
      ORDER BY l.order_number, t.task_id
    `;
    
    const [tasks] = await pool.execute(query, [userId]);
    
    res.json({
      success: true,
      data: tasks
    });

  } catch (error) {
    console.error('Get user roadmap tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting roadmap tasks',
      error: error.message
    });
  }
};

module.exports = {
  getTasksByLevel,
  getUserTasks,
  completeTask,
  assignTaskToUser,
  getTaskProgress,
  updateUserTaskStatus,
  getUserRoadmapTasks
};
