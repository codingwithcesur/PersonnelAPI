"use strict";

/* -------------------------------------------------------------------------- */

// JWT

const Personnel = require("../models/personnel.model");
const jwt = require("jsonwebtoken");
const checkUserAndSetToken = require("../helpers/checkUserAndSetToken");
module.exports = {
  login: async (req, res) => {
    /*
    #swagger.tags = ["Authentication"]
    #swagger.summary = "JWT Login"
    #swagger.description = "Login using username and password"
    #swagger.parameters["body"] = {
      in: "body",
      required: true,
      schema: {
        username: "test",
        password: "1234"
      }
    }
    */
    const checkUser = await checkUserAndSetToken(jwtData);
    if (checkUser.error) {
      res.errorStatusCode = 401;
      throw new Error(checkUser.message);
    } else {
      res.send(checkUser);
    }
  },
  refresh: async (req, res) => {
    /*
    #swagger.tags = ["Authentication"]
      #swagger.summary = "JWT Refresh"
       #swagger.description = "Refresh token"
           #swagger.parameters["body"] = {
      in: "body",
      required: true,
      schema: {
        token: {
          refresh: "...refreshToken..."
        }
      }
    }
    */
    const refreshToken = req.body?.token?.refresh || null;
    if (refreshToken) {
      const jwtData = jwt.verify(refreshToken, process.env.REFRESH_KEY);
      if (jwtData) {
        const checkUser = await checkUserAndSetToken(jwtData, false);
        if (checkUser.error) {
          res.errorStatusCode = 401;
          throw new Error(checkUser.message);
        } else {
          res.send(checkUser);
        }
      } else {
        res.errorStatusCode = 401;
        throw new Error("Invalid refresh token");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please enter refresh token");
    }
  },
  logout: async (req, res) => {
    /*
    #swagger.tags = ["Authentication"]
      #swagger.summary = "JWT Logout"
       #swagger.description = "Logout"
    */
    res.send({
      error: false,
      message: "Logout success",
    });
  },
};
