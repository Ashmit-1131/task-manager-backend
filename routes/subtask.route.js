const express = require('express');
const router  = express.Router({ mergeParams: true });
const { verifyToken } = require('../middlewares/auth.middleware');
const subCtrl = require('../controllers/subtask.controller');

router.get('/',        verifyToken, subCtrl.getSubtasks);
router.put('/',        verifyToken, subCtrl.updateSubtasks);

module.exports = router;
