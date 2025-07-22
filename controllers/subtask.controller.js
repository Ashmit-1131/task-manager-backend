const User = require('../models/user.model');



/**
 * createSubtasks
 * --------------
 * Append one or more new subtasks to a given task.
 * Does not touch existing subtasks or their deleted flags.
 *
 *  POST /tasks/:taskId/subtasks
 *  Protected (requires valid JWT)
 *  Array of subtasks to add, each with:
 *                                     - subject (String, required)
 *                                     - deadline (Date, optional)
 *                                     - status   (String, optional; defaults to "pending")
 */
exports.createSubtasks = async (req, res) => {
  try {
    const { subtasks: newSubs } = req.body;
    // Validate input
    if (!Array.isArray(newSubs) || newSubs.length === 0) {
      return res.status(400).json({ error: 'subtasks must be a non-empty array' });
    }

    // Fetch the user and locate the task
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const task = user.tasks.id(req.params.taskId);
    if (!task || task.deleted) {
      return res.status(404).json({ error: 'Task not found or already deleted' });
    }

    // Append each new subtask
    newSubs.forEach(ns => {
      // Basic validation per item
      if (!ns.subject) {
        throw new Error('Each subtask must have a subject');
      }
      task.subtasks.push({
        subject: ns.subject,
        deadline: ns.deadline || null,
        status: ns.status || 'pending',
        deleted: false
      });
    });

    // Save and return all non-deleted subtasks
    await user.save();
    const updatedList = task.subtasks.filter(s => !s.deleted);
    res.status(201).json(updatedList);
  } catch (err) {
    console.error('Error in createSubtasks:', err);
    res.status(500).json({ error: err.message });
  }
};
/**
 * getSubtasks
 * Fetch all non-deleted subtasks for a given task belonging to the authenticated user.
 */
exports.getSubtasks = async (req, res) => {
    try {
        //retrieve the user by Id and locate the specified task
        const user = await User.findById(req.userId);
        const task = user.tasks.id(req.params.taskId);

        //if task doesn't exist or is deleted, return 404
        if (!task || task.deleted) {
            return res.status(404).json({ error: 'Task not found' });
        }

        //filter out any subtasks marked as deleted
        const subtasks = task.subtasks.filter(s => !s.deleted);
        //return the active subtasks
        res.json(subtasks);
    } catch (err) {
        console.error('Error in getSubtasks:', err);
        res.status(500).json({ error: err.message });
    }
};


/**
 * updateSubtasks
 * --------------
 * Bulk‑sync subtasks for a task:
 * 1. Soft‑delete any existing subtasks not in the incoming list.
 * 2. Update fields on subtasks that already exist.
 * 3. Append any new subtasks.
 * Finally, returns only those subtasks where `deleted === false`.
 */
exports.updateSubtasks = async (req, res) => {
  try {
    const newSubs = req.body.subtasks;
    // 1. Payload validation
    if (!Array.isArray(newSubs)) {
      return res.status(400).json({ error: 'subtasks must be an array' });
    }

    // 2. Load user & task
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const task = user.tasks.id(req.params.taskId);
    if (!task || task.deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // 3. Build set of incoming IDs for quick lookup
    const incomingIds = new Set(
      newSubs
        .filter(ns => ns._id)
        .map(ns => ns._id.toString())
    );

    // 4. Soft‑delete any existing subtask not in the new list
    task.subtasks.forEach(sub => {
      if (!incomingIds.has(sub._id.toString())) {
        sub.deleted = true;
      }
    });

    // 5. Upsert each incoming subtask
    newSubs.forEach(ns => {
      if (ns._id) {
        // Update an existing subtask
        const exist = task.subtasks.id(ns._id);
        if (exist) {
          if (ns.subject  !== undefined) exist.subject  = ns.subject;
          if (ns.deadline !== undefined) exist.deadline = ns.deadline;
          if (ns.status   !== undefined) exist.status   = ns.status;
          // Only update deleted flag if provided explicitly
          if (typeof ns.deleted === 'boolean') {
            exist.deleted = ns.deleted;
          }
        }
      } else {
        // Add a brand‑new subtask
        task.subtasks.push({
          subject:  ns.subject,
          deadline: ns.deadline  || null,
          status:   ns.status    || 'pending',
          deleted:  false
        });
      }
    });

    // 6. Save and respond
    await user.save();
    const updated = task.subtasks.filter(s => !s.deleted);
    res.json(updated);

  } catch (err) {
    console.error('Error in updateSubtasks:', err);
    res.status(500).json({ error: err.message });
  }
};

