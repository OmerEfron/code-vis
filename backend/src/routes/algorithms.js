const express = require('express');
const router = express.Router();
const algorithmsController = require('../controllers/algorithms');

router.post('/hoffman', algorithmsController.analyzeHoffman);


module.exports = router;