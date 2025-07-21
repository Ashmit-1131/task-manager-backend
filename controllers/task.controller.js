const User = require('../models/user.model');

/**
 * getTasks
 * retrieve all tasks for the authenticated user, excluding any that have been soft-deleted.
 * Also filters out subtasks marked as deleted.
 */
exports.getTasks = async (req, res) => {
  try {
    // Fetch the user document from the database
    const user = await User.findById(req.userId).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter out deleted tasks and deleted subtasks
    const tasks = (user.tasks || [])
      .filter(task => !task.deleted)
      .map(task => ({
        ...task,
        subtasks: (task.subtasks || []).filter(sub => !sub.deleted)
      }));

    // return the cleaned list of tasks
    res.json(tasks);
  } catch (err) {
    console.error('Error in getTasks:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * createTask
 * Add a new task to the authenticated user's task list.
 * Initializes it with no subtasks and a deleted flag set to false.
 */
exports.createTask = async (req, res) => {
  try {
    const { subject, deadline, status } = req.body;
    const user = await User.findById(req.userId);

    // Push a new task into the user's tasks array
    user.tasks.push({
      subject,
      deadline,
      status,
      deleted: false,
      subtasks: []
    });

    await user.save();

    // respond with the newly created task (last in the array)
    const newTask = user.tasks[user.tasks.length - 1];
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error in createTask:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * updateTask
 * Modify an existing task's details (subject, deadline, status).
 * Only non-deleted tasks can be updated.
 */
exports.updateTask = async (req, res) => {
  try {
    const { subject, deadline, status } = req.body;
    const user = await User.findById(req.userId);
    const task = user.tasks.id(req.params.taskId);

    // If task doesn't exist or is already deleted,return 404
    if (!task || task.deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // update only the provided fields
    if (subject !== undefined) task.subject = subject;
    if (deadline !== undefined) task.deadline = deadline;
    if (status !== undefined) task.status = status;

    await user.save();

    // return the updated task
    res.json(task);
  } catch (err) {
    console.error('Error in updateTask:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * deleteTask
 * Soft-delete a task by setting its deleted flag to true.
 * The task remains in the database but is excluded from future queries.
 
 */
exports.deleteTask = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const task = user.tasks.id(req.params.taskId);

    // If task doesn't exist or is already deleted, return 404
    if (!task || task.deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Mark the task as deleted and save
    task.deleted = true;
    await user.save();

    // Confirm deletion to the client
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error in deleteTask:', err);
    res.status(500).json({ error: err.message });
  }
};
