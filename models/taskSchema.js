
/**
 * SubtaskSchema
 * Defines the structure for individual subtasks embedded within a Task.
 * Fields:
 *  - subject: brief description of the subtask (required)
 *  - deadline: optional due date for the subtask
 *  - status: tracking field (default: 'pending')
 *  - deleted: soft-delete flag (default: false)
 */
const mongoose    = require('mongoose');
const SubtaskSchema = new mongoose.Schema({
  subject:   { type: String, required: true },
  deadline:  { type: Date, default: null },
  status:    { type: String, default: 'pending' },
  deleted:   { type: Boolean, default: false }
}, { _id: true });

/**
 * TaskSchema
 * ----------
 * Represents a user task, which may contain multiple subtasks.
 * Fields:
 *  - subject: brief description of the task (required)
 *  - deadline: optional due date for the task
 *  - status: tracking field (default: 'pending')
 *  - deleted: soft-delete flag (default: false)
 *  - subtasks: array of SubtaskSchema embedded documents
 */
const TaskSchema = new mongoose.Schema({
  subject:   { type: String, required: true },
  deadline:  { type: Date, default: null },
  status:    { type: String, default: 'pending' },
  deleted:   { type: Boolean, default: false },
  subtasks: [ SubtaskSchema ]
}, { _id: true });

module.exports = { TaskSchema, SubtaskSchema };
