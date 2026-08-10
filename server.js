const express = require('express');
const cors = require('cors');
require('dotenv').config();
const chatRoutes = require('./routes/chat.routes');
const uploadRoutes = require('./routes/upload.routes');
const AskGemini = require('./services/gemini.service');


const app = express();
const port = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// routes:
app.use('/api', chatRoutes);
app.use('/api', uploadRoutes)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});