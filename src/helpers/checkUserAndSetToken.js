"use strict";

module.exports = async function (userData) {
  const { username, password } = userData;
  if (username && password) {
    const user = await Personnel.findOne({ username, password });
    if (user) {
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
        const refreshToken = jwt.sign(refreshData, process.env.REFRESH_KEY, {
          expiresIn: "3d",
        });

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
