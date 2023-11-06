"use strict";

const Personnel = require("../models/personnel.model");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Personnel);
    res.status(200).send({
      error: false,
      detail: await res.getModelListDetails(Personnel),
      data,
    });
  },
  create: async (req, res) => {
    // isLead Control:
    const isLead = req.body?.isLead || false;
    if (isLead) {
      const xyz = await Personnel.updateMany(
        {
          departmentId: req.body.departmentId,
          isLead: true,
        },
        { isLead: false }
      );
    }

    const data = await Personnel.create(req.body);
    res.status(201).send({
      error: false,

      data,
    });
  },
  read: async (req, res) => {
    const data = await Personnel.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    // isLead Control:
    const isLead = req.body?.isLead || false;
    if (isLead) {
      const { departmentId } = await Personnel.findOne(
        { _id: req.params.id },
        { departmentId: 1 }
      );
      await Personnel.updateMany(
        { departmentId, isLead: true },
        { isLead: false }
      );
    }

    const data = await Personnel.updateOne({ _id: req.params.id }, req.body);
    res.status(202).send({
      error: false,
      data,
      new: await Personnel.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    const data = await Personnel.deleteOne({ _id: req.params.id });
    const isDeleted = data.deletedCount >= 1 ? true : false;
    res.status(isDeleted ? 204 : 404).send({
      error: isDeleted,
      data,
    });
  },
};
