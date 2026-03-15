const fs = require("fs");
const pdfParse = require("pdf-parse");
const { generateEmbedding } = require("../services/embedding.service");
const { client, COLLECTION_NAME } = require("../services/vector.services");

function splitIntoChunks(text, chunkSize = 300) {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}

async function uploadDocument(req, res) {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(buffer);

    const chunks = splitIntoChunks(data.text);

    const points = [];

    for (let i = 0; i < chunks.length; i++) {

      const embedding = await generateEmbedding(chunks[i]);

      points.push({
        id: Date.now() + i,
        vector: embedding,
        payload: {
          text: chunks[i]
        }
      });

    }

    // store vectors in Qdrant
    await client.upsert(COLLECTION_NAME, {
      points: points
    });

    res.json({
      message: "Document processed",
      totalChunks: chunks.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
}

module.exports = { uploadDocument };