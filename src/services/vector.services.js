const { QdrantClient } = require("@qdrant/js-client-rest");

const client = new QdrantClient({
  url: "http://localhost:6333"
});

const COLLECTION_NAME = "documents";

async function initVectorDB() {
  try {
    const collections = await client.getCollections();

    const exists = collections.collections.some(
      c => c.name === COLLECTION_NAME
    );

    if (!exists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 384,
          distance: "Cosine"
        }
      });

      console.log("Vector collection created");
    } else {
      console.log("Vector collection already exists");
    }

  } catch (error) {
    console.error("Vector DB error:", error);
  }
}

module.exports = {
  client,
  COLLECTION_NAME,
  initVectorDB
};