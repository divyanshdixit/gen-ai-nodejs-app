const fs = require("fs");
const {PDFParse} = require("pdf-parse");

async function extractText(filePath) {

    try {
        const buffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        return data.text;

    } catch (error) {
        console.log(error);
        throw error;
    }

}

module.exports = { extractText};