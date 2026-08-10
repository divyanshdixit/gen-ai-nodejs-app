const express = require('express');
const upload = require('../config/storage');
const chat = require('../controllers/chat.controller');

const router = express.Router();

router.post('/upload', upload.single("pdf"), chat.uploadPDF);

module.exports = router;