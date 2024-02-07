const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public_api');

router.use('/movie_data', publicController.movie_data);
router.use('/get_telecore_data', publicController.get_telecore_data);
router.use('/api', publicController.api);

module.exports = router;
