const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

async function askLLM(prompt) {
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("LLM ERROR:", error);
    throw error;
  }
}

module.exports = { askLLM };