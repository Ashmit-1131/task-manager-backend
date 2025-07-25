
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db.config');
const authRoutes = require('./routes/user.route');
const taskRoutes    = require('./routes/task.route');
const subtaskRoutes = require('./routes/subtask.route');


const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
// This mounts /tasks/:taskId/subtasks to subtaskRoutes
app.use('/tasks/:taskId/subtasks', subtaskRoutes);




app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


