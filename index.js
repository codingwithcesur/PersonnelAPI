"use strict";

const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env?.PORT || 8000;

require("express-async-errors");

// Database connection
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/* ---------------------------------- */
// Middlewares
app.use(express.json());

app.use(require("cookie-session")({ secret: process.env.SECRET_KEY }));

// For search, sort, pagination
app.use(require("./src/middlewares/findSearchSortPage"));

// For login, logout
app.use(async (req, res, next) => {
  const Personnel = require("./src/models/personnel.model");

  req.isLogin = false;

  if (req.session?.id) {
    const user = await Personnel.findOne({ _id: req.session.id });

    req.isLogin = user.password == req.session.password;
  }
  console.log("isLogin: ", req.isLogin);

  next();
});

/* ---------------------------------- */
// Routes
// Home
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to Personnel API",
    session: req.session,
    isLogin: req.isLogin,
  });
});

// Auth
app.use("/auth", require("./src/routes/auth.router"));
// Department
app.use("/departments", require("./src/routes/department.router"));
// Personnel
app.use("/personnels", require("./src/routes/personnel.router"));
/* ---------------------------------- */
// Error handler
app.use(require("./src/middlewares/errorHandler"));

/* ---------------------------------- */
// Run server
app.listen(PORT, () => {
  console.log(`Server is running: http://127.0.0.1:${PORT}`);
});

// Sync database
// require("./src/helpers/sync")();
