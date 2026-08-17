const geminiClient = require("../config/gemini");

async function generateEmbedding(text) {
    
     const response = await geminiClient.models.embedContent({
        model: "gemini-embedding-001",
        contents: text
    });
    const embeddingss = response.embeddings[0].values;
    return embeddingss;

}

module.exports = {
    generateEmbedding
};