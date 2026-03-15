require("dotenv").config();
const express = require("express");
const cors = require("cors");

const aiRoutes = require("./src/routes/ai.routes");
const documentRoutes = require("./src/routes/document.routes");

const { initVectorDB } = require("./src/services/vector.services");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/ai", aiRoutes);
app.use("/api/doc", documentRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {

    await initVectorDB();   // initialize qdrant collection

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
  }
}

startServer();