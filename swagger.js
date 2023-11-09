"use strict";

require("dotenv").config();
const HOST = process.env?.HOST || "127.0.0.1";
const PORT = process.env?.PORT || 8000;
/* -------------------------------------------------------------------------- */

const swaggerAutogen = require("swagger-autogen")();
const packageJson = require("./package.json");

const document = {
  info: {
    version: "packageJson.version",
    title: "packageJson.title",
    description: "packageJson.description",
    termsOfService: "http://www.clarusway.com",
    contact: { name: "packageJson.author", email: "qadir@clarusway.com" },
    license: { name: "packageJson.license" },
  },
  host: `${HOST}:${PORT}`,
  basePath: "/",
  schemes: ["http", "https"],
  // JWT Settings:
  securityDefinitions: {
    JWT: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "Entry Your AccessToken (JWT) for Login. Example: <b>Bearer <i>...token...<i></b>",
    },
  },
  security: [{ JWT: true }],
};

const routes = ["./index.js"];
const outputFile = "./swagger.json";

// Create swagger.json file
swaggerAutogen(outputFile, routes, document);
