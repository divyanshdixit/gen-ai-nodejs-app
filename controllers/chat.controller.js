const AskGemini = require("../services/gemini.service");
const { extractText } = require("../services/pdf.service");
const geminiClient = require("../config/gemini");
const { chunkText } = require("../services/chunk.service");
const { generateEmbedding } = require("../services/embedding.service");

function getHome(req, res) {
  console.log("Home route");
  res.send("Working home route...");
}

async function generateContent(req, res) {
  console.log("api key checking..", process.env.GEMINI_API_KEY);
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const reply = await AskGemini(prompt);
    res.json({ success: true, text: reply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
}

async function uploadPDF(req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }
    // step 1: extract text 
    const pdfText = await extractText(req.file.path);

    // step 2: chunk text
    const chunks = await chunkText(pdfText, 1000);

    // step: 3: generate embeddings
    const results = [];
    for (const chunk of chunks){
      const embedding = await generateEmbedding(chunk);
      results.push({
        chunk,
        embedding
      })
    }

    return res.status(200).json({
            success: true,
            totalChars: pdfText.length,
            totalChunks: results.length,
            chunks,
            message: "PDF uploaded successfully.",
            originalName: req.file.originalname,
            extractedText: pdfText,
            data: results
        });
    // return res.status(200).json({
    //   success: true,
    //   file: {
    //     originalName: req.file.originalname,
    //     fileName: req.file.filename,
    //     path: req.file.path,
    //     size: req.file.size,
    //   },
    // });
  } catch (error) {
    return res.status(500).json({
            success: false,
            message: error.message
        });
  }
}


module.exports = {
  getHome,
  generateContent,
  uploadPDF,
};
