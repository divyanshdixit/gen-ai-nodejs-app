const {AskGemini, generateStreamingAnswer} = require("../services/gemini.service");
const { extractText } = require("../services/pdf.service");
const geminiClient = require("../config/gemini");
const { chunkText } = require("../services/chunk.service");
const { generateEmbedding } = require("../services/embedding.service");
const {createCollection, storeEmbeddingsInChroma, searchSimilarChunks} = require("../services/chroma.service");
const { buildPrompt } = require("../services/prompt.service");

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

async function askQuestion(req, res) {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  try{
    // convert question to embedding:
    const questionEmbedding = await generateEmbedding(question); // vector []

    // get collection and search for similar chunks in chromaDb:
    const collection = await createCollection();
    const result = await searchSimilarChunks(collection, questionEmbedding, 3)
  
    // now build prompt with the question and the context (similar chunks)
    const prompt = buildPrompt(question, result.documents[0]);

    // now ask gemini with the prompt and return the answer:
    // const answer = await AskGemini(prompt); 

    // you will get streaming answer. 
    const streamingAnswer = await generateStreamingAnswer(prompt); 

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    for await (const chunk of streamingAnswer){
      const text = chunk.text;
      res.write(text);
    }

    res.end();

    // return res.status(200).json({
    //   success: true,
    //   data: result,
    //   prompt,
    //   answer,
    //   sources: result.metadatas[0]
    // })
  }catch(err){
    console.error("Error asking question:", err);
    return res.status(500).json({ error: "Failed to process question" });
  }
}

module.exports = {
  getHome,
  generateContent,
  uploadPDF,
  getStoredData,
  askQuestion
};
