
const User = require('../models/user.model');


exports.getSubtasks = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const task = user.tasks.id(req.params.taskId);

        if (!task || task.deleted)
            return res.status(404).json({ error: 'Task not found' });

        const subtasks = task.subtasks.filter(s => !s.deleted);
        res.json(subtasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateSubtasks = async (req, res) => {
    try {
        const newSubs = req.body.subtasks; 
        const user = await User.findById(req.userId);
        const task = user.tasks.id(req.params.taskId);

        if (!task || task.deleted)
            return res.status(404).json({ error: 'Task not found' });

   
        task.subtasks.forEach(sub => {
            const keep = newSubs.find(ns => ns._id && ns._id === sub._id.toString());
            if (!keep) sub.deleted = true;
        });

  
        newSubs.forEach(ns => {
            if (ns._id) {
                const exist = task.subtasks.id(ns._id);
                if (exist) {
                    exist.subject = ns.subject;
                    exist.deadline = ns.deadline;
                    exist.status = ns.status;
                    exist.deleted = false;
                }
            } else {
                task.subtasks.push({
                    subject: ns.subject,
                    deadline: ns.deadline,
                    status: ns.status,
                    deleted: false
                });
            }
        });

        await user.save();
        const updated = task.subtasks.filter(s => !s.deleted);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
