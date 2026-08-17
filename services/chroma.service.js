const {ChromaClient} = require('chromadb');
const client = new ChromaClient();

// client is connection b/w node js app and chroma db server. 

async function createCollection(){

    return await client.getOrCreateCollection({
        name: "employee_docs",
    });

}

/*
{
    id: [1,2,3]
    documents: [chunk1, chunk2, chunk3, chunk 4....],
    embeddings: [emd1, emd2, emd3]
    metadata: [{source:bank-declartion-1.pdf, chunkNumber: 1}, ]
}
*/
async function storeEmbeddingsInChroma(collection, results, fileName) {
    const ids = [];
    const documents = [];
    const embeddings = [];
    const metadatas = [];

    results.forEach((element, idx) => {
        ids.push(`${fileName}-${idx}`);
        documents.push(element.chunk);
        embeddings.push(element.embedding);
        metadatas.push({
            source: fileName, 
            chunkNumber: idx + 1
        })
    });

    await collection.add({
        ids,
        documents,
        embeddings,
        metadatas
    })
}

module.exports = {
    createCollection,
    storeEmbeddingsInChroma
};