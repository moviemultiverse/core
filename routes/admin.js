const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.use('/workflow', adminController.workflow);
router.use('/size',adminController.size);
router.use('/getvidfiles',adminController.getvidfiles);
router.use('/getfiles',adminController.getfiles);
router.use('/getrepo',adminController.getrepo);
router.use('/deletefile',adminController.deletefile);
router.use('/artifact',adminController.artifact);
router.use('/getmappeddata',adminController.getmappeddata);
module.exports = router;
