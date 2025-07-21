
const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  subject:   { type: String, required: true },
  deadline:  { type: Date, default: null },
  status:    { type: String, default: 'pending' },
  deleted:   { type: Boolean, default: false }
}, { _id: true });

const TaskSchema = new mongoose.Schema({
  subject:   { type: String, required: true },
  deadline:  { type: Date, default: null },
  status:    { type: String, default: 'pending' },
  deleted:   { type: Boolean, default: false },
  subtasks: [ SubtaskSchema ]
}, { _id: true });

module.exports = { TaskSchema, SubtaskSchema };
