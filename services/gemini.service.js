const geminiClient = require("../config/gemini");

async function AskGemini(message) {
  // Using the recommended fast model (service)
  const response = await geminiClient.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: message,
  });

  return response.text;
}

module.exports = AskGemini;