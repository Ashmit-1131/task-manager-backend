const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const taskCtrl = require('../controllers/task.controller');

router.get('/',        verifyToken, taskCtrl.getTasks);
router.post('/',       verifyToken, taskCtrl.createTask);
router.put('/:taskId', verifyToken, taskCtrl.updateTask);
router.delete('/:taskId', verifyToken, taskCtrl.deleteTask);

module.exports = router;
