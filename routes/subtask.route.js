
const express = require('express');
const router  = express.Router({ mergeParams: true });
const { verifyToken } = require('../middlewares/auth.middleware');
const subCtrl = require('../controllers/subtask.controller');

/**
 *GET /tasks/:taskId/subtasks
 * Retrieve all non-deleted subtasks for a specific task
 * Protected (requires valid JWT)
 */
router.get(
  '/',
  verifyToken,       // Ensure the user is authenticated
  subCtrl.getSubtasks // Controller to fetch subtasks
);
/**
 *POST /tasks/:taskId/subtasks
 * create subtasks for a specific task
 * Protected (requires valid JWT)
 */
router.post(  '/', 
      verifyToken,
       subCtrl.createSubtasks);  

/**
 * PUT /tasks/:taskId/subtasks
 * Replace or update the list of subtasks for a specific task
 * Soft-deletes omitted subtasks, updates existing, and adds new ones.
 * Protected (requires valid JWT)
 */
router.put(
  '/',
  verifyToken,          // Ensure the user is authenticated
  subCtrl.updateSubtasks // Controller to update subtasks
);

module.exports = router; // Export the router to be used in index.js
