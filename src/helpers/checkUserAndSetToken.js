"use strict";

const jwt = require("jsonwebtoken");
const Personnel = require("../models/personnel.model");

module.exports = async function (userData, withRefresh = true) {
  const { username, password } = userData;
  if (username && password) {
    const user = await Personnel.findOne({ username });
    if (user && user.password == password) {
      if (user.isActive) {
        // Login success
        const accessData = {
          _id: user._id,
          departmentId: user.departmentId,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          isAdmin: user.isAdmin,
          isLead: user.isLead,
        };
        const accessToken = jwt.sign(accessData, process.env.ACCESS_KEY, {
          expiresIn: "30m",
        });

        const refreshData = {
          username: user.username,
          password: user.password,
        };
        const refreshToken = withRefresh
          ? jwt.sign(refreshData, process.env.REFRESH_KEY, {
              expiresIn: "3d",
            })
          : null;

        return {
          error: false,
          token: {
            access: accessToken,
            refresh: refreshToken,
          },
        };
      } else {
        return {
          error: true,
          message: "User is not active",
        };
      }
    } else {
      return {
        error: true,
        message: "Username or password is incorrect",
      };
    }
  } else {
    return {
      error: true,
      message: "Please enter username and password",
    };
  }
};
