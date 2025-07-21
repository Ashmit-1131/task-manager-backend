
const User = require('../models/user.model');


exports.getTasks = async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tasks = user.tasks
      .filter(t => !t.deleted)
      .map(t => ({
        ...t,
        subtasks: t.subtasks.filter(s => !s.deleted)
      }));

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createTask = async (req, res) => {
  try {
    const { subject, deadline, status } = req.body;
    const user = await User.findById(req.userId);

    user.tasks.push({ subject, deadline, status, deleted: false, subtasks: [] });
    await user.save();

    const newTask = user.tasks[user.tasks.length - 1];
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { subject, deadline, status } = req.body;
    const user = await User.findById(req.userId);
    const task = user.tasks.id(req.params.taskId);

    if (!task || task.deleted) 
      return res.status(404).json({ error: 'Task not found' });

    if (subject !== undefined) task.subject = subject;
    if (deadline !== undefined) task.deadline = deadline;
    if (status !== undefined) task.status = status;

    await user.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const task = user.tasks.id(req.params.taskId);

    if (!task || task.deleted) 
      return res.status(404).json({ error: 'Task not found' });

    task.deleted = true;
    await user.save();

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
