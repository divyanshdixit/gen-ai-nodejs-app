const AskGemini = require("../services/gemini.service");
const { extractText } = require("../services/pdf.service");
const geminiClient = require("../config/gemini");
const { chunkText } = require("../services/chunk.service");
const { generateEmbedding } = require("../services/embedding.service");
const {createCollection, storeEmbeddingsInChroma} = require("../services/chroma.service");

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
    // step 1: extract text - parsing the pdf text
    const pdfText = await extractText(req.file.path);
    
    // step 2: chunk text
    const chunks = await chunkText(pdfText, 1000); // 4000 => 4 chunk
    console.log(chunks)
    
    // step: 3: generate embeddings
    const results = [];
    for (const chunk of chunks){
      const embedding = await generateEmbedding(chunk);
      results.push({
        chunk,
        embedding
      })
    }

    // step: 4- store info in chromaDb.

    const collection = await createCollection();
    await storeEmbeddingsInChroma(collection, results, req.file.filename)
    const totalCount = await collection.count();
    const storedData = await collection.get();

    // {include: [
    //     "documents",
    //     "embeddings",
    //     "metadatas"
    // ]};
    // console.log("Stored data in ChromaDB:", storedData);

    return res.status(200).json({
            success: true,
            totalChars: pdfText.length,
            totalChunks: results.length,
            message: "Pdf stored + chunked + embed gen + stored in db",
            originalName: req.file.originalname,
            data: results,
            // totalCount
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

async function getStoredData (req, res){
  try{
    const collection = await createCollection();
    const storedData = await collection.get({
      include: [
        "metadatas"
      ]
    });

    return res.status(200).json({
      message: "Information fetched successfully!",
      data: storedData
    })
  }catch(err){
    console.log(err);
    return res.status(500).json({
      message: "Error fetching stored data"
    });
  }
  
}

module.exports = {
  getHome,
  generateContent,
  uploadPDF,
  getStoredData
};
