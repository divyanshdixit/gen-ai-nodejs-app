const geminiClient = require("../config/gemini");

async function generateEmbedding(text) {
    
     const response = await geminiClient.models.embedContent({
        model: "gemini-embedding-001",
        contents: text
    });
    console.log(response)
    const embeddingss = response.embeddings[0].values;
    console.log('embeddings--', embeddingss, '--');
    return embeddingss;

}

module.exports = {
    generateEmbedding
};