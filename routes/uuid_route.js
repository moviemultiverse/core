const express = require('express');
const router = express.Router();
const userController = require('../controllers/uuid_controller');

router.use('/getuuid', userController.getuuid);
router.use('/createuuid', userController.createuuid);
router.use('/fetchtoken', userController.fetchtoken);

module.exports = router;
