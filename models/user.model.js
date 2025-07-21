const mongoose    = require('mongoose');
const { TaskSchema } = require('./taskSchema');
/**
 * UserSchema
 * Defines the structure for a User document, including authentication
 * details and an embedded list of tasks (with subtasks).
 * Fields:
 *  - name:full name of the user (required)
 *  - email:unique email address used for login (required, unique)
 *  - password:hashed password for authentication (required)
 *  - tasks: array of TaskSchema embedded documents
 */
const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks:    [ TaskSchema ]
});

// Export the User model based on UserSchema
module.exports = mongoose.model('User', UserSchema);
