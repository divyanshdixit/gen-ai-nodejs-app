const geminiClient = require("../config/gemini");

async function AskGemini(message) {
  // Using the recommended fast model (service)
  const response = await geminiClient.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: message,
  });

  return response.text;
}

async function generateStreamingAnswer(prompt){
  const stream = await geminiClient.models.generateContentStream({ // chunk1 - 1.5secs
    model: "gemini-3.5-flash-lite",
    contents: prompt,
  })

  return stream;
}

module.exports = {
  AskGemini,
  generateStreamingAnswer
};