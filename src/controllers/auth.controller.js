"use strict";

/* -------------------------------------------------------------------------- */

// JWT

const Personnel = require("../models/personnel.model");
const jwt = require("jsonwebtoken");
const checkUserAndSetToken = require("../helpers/checkUserAndSetToken");
module.exports = {
  login: async (req, res) => {
    const checkUser = checkUserAndSetToken(req.body);
    if (checkUser.error) {
      res.errorStatusCode = 401;
      throw new Error(checkUser.message);
    } else {
      res.send(checkUser);
    }
  },
  refresh: async (req, res) => {
    const refreshToken = req.body?.token?.refresh || null;
    if (refreshToken) {
      const jwtData = jwt.verify(refreshToken, process.env.REFRESH_KEY);
      if (jwtData) {
        const checkUser = checkUserAndSetToken(req.body);
        if (checkUser.error) {
          res.errorStatusCode = 401;
          throw new Error(checkUser.message);
        } else {
          res.send(checkUser);
        }
      }
    }
  },
  logout: async (req, res) => {
    res.send({
      error: false,
      message: "Logout success",
    });
  },
};
