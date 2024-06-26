const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");
const {
  createTransportation,
  getTransportation,
  updateTransportation,
  removeTransportation,
  addSpending,
  updateSpending,
  removeSpending,
  getSpending,
} = require("../../controllers/transportation/transportationController");

router
  .route("/")
  .post(verifyAdministratorOrEditor, createTransportation)
  .get(verifyAdministratorOrEditor, getTransportation)
  .delete(verifyAdministratorOrEditor, removeTransportation)
  .put(verifyAdministratorOrEditor, updateTransportation);

router
  .route("/spending/:name/:type/:phone")
  .get(verifyAdministratorOrEditor, getSpending)
  .post(verifyAdministratorOrEditor, addSpending)
  .put(verifyAdministratorOrEditor, updateSpending)
  .delete(verifyAdministratorOrEditor, removeSpending);

module.exports = router;
