const { askLLM } = require("../services/llm.service");
const { generateEmbedding } = require("../services/embedding.service");
const { client, COLLECTION_NAME } = require("../services/vector.services");

async function askQuestion(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Step 1: Convert question → embedding vector
    const questionEmbedding = await generateEmbedding(question);

    // Step 2: Search similar chunks in Qdrant
    const searchResult = await client.search(COLLECTION_NAME, {
      vector: questionEmbedding,
      limit: 5
    });

    if (!searchResult.length) {
      return res.status(404).json({ error: "No relevant document context found" });
    }

    // Step 3: Extract chunk text from payload
    const context = searchResult
      .map(result => result.payload.text)
      .join("\n\n");

    // Step 4: Build prompt
    const prompt = `
You are a document assistant.
Answer ONLY using the document below.

DOCUMENT:
${context}

QUESTION:
${question}
`;

    // Step 5: Ask LLM
    const answer = await askLLM(prompt);

    res.json({ answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI failed" });
  }
}

module.exports = { askQuestion };