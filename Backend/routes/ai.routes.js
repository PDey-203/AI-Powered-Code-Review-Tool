const express = require('express');
const codeReviewController = require('../controller/ai.controller');
const router = express.Router();

router.post('/ai', codeReviewController)

module.exports = router;