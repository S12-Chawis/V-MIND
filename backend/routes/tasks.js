const express = require('express');
const router = express.Router();
const {
  getTasksByLevel,
  getUserTasks,
  completeTask,
  assignTaskToUser,
  getTaskProgress,
  updateUserTaskStatus,
  getUserRoadmapTasks
} = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

// Public routes
router.get('/level/:levelId', getTasksByLevel);

// Protected routes
router.get('/user/my-tasks', auth, getUserTasks);
router.get('/user/roadmap-tasks', auth, getUserRoadmapTasks);
router.get('/user/progress', auth, getTaskProgress);
router.post('/:taskId/assign', auth, assignTaskToUser);
router.put('/:userTaskId/complete', auth, completeTask);
router.put('/user/status', auth, updateUserTaskStatus);

module.exports = router;
