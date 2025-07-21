// routes/task.routes.js

const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const taskCtrl = require('../controllers/task.controller');

/**
 * GET /tasks
 * Retrieve all non-deleted tasks for the authenticated user
 * Protected (requires valid JWT)
 */
router.get(
  '/',
  verifyToken,    // Check for valid JWT token
  taskCtrl.getTasks // Controller method to fetch tasks
);

/**
 *POST /tasks
 *Create a new task for the authenticated user
 *Protected (requires valid JWT)
 */
router.post(
  '/',
  verifyToken,      // Ensure the user is authenticated
  taskCtrl.createTask // Controller method to add a task
);

/**
 * PUT /tasks/:taskId
 * Update an existing task's details (subject, deadline, status)
 * Protected (requires valid JWT)
 */
router.put(
  '/:taskId',
  verifyToken,      // Ensure the user is authenticated
  taskCtrl.updateTask // Controller method to modify a task
);

/**
 *DELETE /tasks/:taskId
 *Soft-delete a task by marking its deleted flag
 *Protected (requires valid JWT)
 */
router.delete(
  '/:taskId',
  verifyToken,      // Ensure the user is authenticated
  taskCtrl.deleteTask // Controller method to soft-delete a task
);

module.exports = router; // Export the task routes for server.js
