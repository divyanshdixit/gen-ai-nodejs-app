
function buildPrompt(question, chunks){
    // Gemini expects ONE string Not an array.
    
    const context = chunks.join("\n\n");
    const prompt = `You are a helpful assistant. 
    Use the following context to answer the question. If the context does not contain the answer, say "I couldn't find that information."
    Context: ${context}
    Question: ${question}`

    return prompt;
}

module.exports = {
    buildPrompt
}