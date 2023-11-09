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

// Logger
const morgan = require("morgan");
// app.use(
//   morgan(
//     'IP: :remote-addr - :remote-user ****** TIME: [:date[clf]] ****** REQ: ":method :url HTTP/:http-version" ****** RES: :status :res[content-length] ****** APP: ":referrer" ":user-agent"'
//   )
// );

// Logger to file
const fs = require("node:fs");
const now = new Date();
const today = now.toISOString().split("T")[0];
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(`./logs/${today}.log`, { flags: "a" }),
  })
);

app.use(express.json());

app.use(require("cookie-session")({ secret: process.env.SECRET_KEY }));

// For search, sort, pagination
app.use(require("./src/middlewares/findSearchSortPage"));

// For login, logout (old using cookie-session)
// app.use(async (req, res, next) => {
//   const Personnel = require("./src/models/personnel.model");

//   req.isLogin = false;

//   if (req.session?.id) {
//     const user = await Personnel.findOne({ _id: req.session.id });

//     req.isLogin = user.password == req.session.password;
//   }
//   console.log("isLogin: ", req.isLogin);

//   next();
// });

// For login, logout (new using jwt)
app.use(require("./src/middlewares/authentication"));

// Swagger-UI
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("./swagger.json");
// Parse/Run swagger.json and publish on any URL:
app.use(
  "/docs/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJson, {
    swaggerOptions: { persistAuthorization: true },
  })
);
// Redoc-UI
const redoc = require("redoc-express");
app.use("/docs/json", (req, res) => {
  res.sendFile("./swagger.json"), { root: "." };
});
app.use(
  "/docs/redoc",
  redoc({
    specUrl: "/docs/json",
    title: "API Documentation",
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: "#6EC5AB",
          },
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: "15px",
          lineHeight: "1.5",
          code: {
            code: "#87E8C7",
            backgroundColor: "#4D4D4E",
          },
        },
        menu: {
          backgroundColor: "#ffffff",
        },
      },
    },
  })
);
/* ---------------------------------- */
// Routes
// Home
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to Personnel API",
    api: {
      docs: {
        json: "/docs/json",
        swagger: "/docs/swagger",
        redoc: "/docs/redoc",
      },
    },
    // session: req.session, // old using cookie-session
    isLogin: req.isLogin,
    user: req.user,
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
