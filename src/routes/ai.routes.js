const express = require("express");
const { askQuestion } = require("../controllers/ai.controller");

const router = express.Router();

router.post("/ask", askQuestion);

module.exports = router;