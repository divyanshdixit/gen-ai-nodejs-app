const ChromaClient = require('chromadb');
const geminiClient = require("../config/gemini");

// const client = new ChromaClient();

// const collection = await client.createCollection({
//   name: "company_docs",
// });

// Use an embedding model to convert each chunk into a vector before storing it.
async function convertToEmbedding(chunk) {
    const embedding = await geminiClient.models.embedContent({
        model: "gemini-3.6-flash",
        content: chunk
    });
    const embeddingss = embedding.embeddings[0].values;
    console.log('embeddings--', embeddingss, '--');
    return embeddingss;
}

// store documents 

// await collection.add({
//   ids: ["1", "2"],
//   documents: [
//     "Annual leave policy",
//     "Health insurance",
//   ],
//   metadata: [
//     {source: "hr.pdf",page:2},
//     {source:"benefits.pdf",page:8}
//   ]
// });

module.exports = convertToEmbedding;