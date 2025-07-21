
const mongoose = require('mongoose');
const { TaskSchema } = require('./taskSchema');
const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
    tasks:    [ TaskSchema ]

});

module.exports = mongoose.model('User', UserSchema);
