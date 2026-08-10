const express = require('express');
const chat = require('../controllers/chat.controller');
const upload = require('../config/storage');

const router = express.Router();

router.get('/', chat.getHome);
router.post('/generate', chat.generateContent);

module.exports = router;