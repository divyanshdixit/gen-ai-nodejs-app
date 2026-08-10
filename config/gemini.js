const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client
const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports = geminiClient;