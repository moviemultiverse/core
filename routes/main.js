const express = require('express');
const router = express.Router();
const mainController = require('../controllers/main');

router.use('/deletefile',mainController.deletefile);
router.use('/createrepo',mainController.createrepo);
router.use('/createreposeries',mainController.createreposeries);

module.exports = router;