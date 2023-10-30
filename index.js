"use strict";

const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env?.PORT || 8000;

require("express-async-errors");

app.use(express.json());

// Error handler
app.use(require("./middlewares/errorHandler"));

app.listen(PORT, () => {
  console.log(`Server is running: http://127.0.0.1:${PORT}`);
});
