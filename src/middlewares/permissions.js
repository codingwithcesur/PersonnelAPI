"use strict";

module.exports = {
  isLogin: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("You must login");
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("You must be admin");
    }
  },

  isAdminOrLead: (req, res, next) => {
    const departmentId = req.params?.id || null;
    if (
      req.user &&
      (req.user.isAdmin ||
        (req.user.isLead && req.user.departmentId == departmentId))
    ) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("You must be admin or department lead");
    }
  },

  isAdminOrOwner: (req, res, next) => {
    const userId = req.params?.id || null;
    if (req.user && (req.user.isAdmin || req.user._id == userId)) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("You must be admin or owner");
    }
  },
};
