function chunkText(text, chunkSize = 1000) {
    const chunks = [];
     for (let i = 0; i < text.length; i += chunkSize) { // i= 0 + 1000
        const chunk = text.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
}

module.exports = {chunkText}