"use strict";

const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const auth = req.headers?.authorization || null; // get auth
  const accessToken = auth ? auth.split(" ")[1] : null; // get token (jwt)

  req.isLogin = false;
  jwt.verify(accessToken, process.env.ACCESS_KEY, function (err, user) {
    if (err) {
      req.user = null;
      // console.log("Jwt login: not login");
    } else {
      req.isLogin = true;
      req.user = user;
      // console.log("Jwt login: Login success");
    }
  });
  next();
};
