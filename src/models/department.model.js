"use strict";

const { mongoose } = require("../configs/dbConnection");

/* ------------------------------------------------------- */

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
  },
  { collection: "departments", timestamps: true }
);

/* ------------------------------------------------------- */
module.exports = mongoose.model("Department", departmentSchema);
