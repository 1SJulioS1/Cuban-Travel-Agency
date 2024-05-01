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
} = require("../../controllers/transportation/transportationController");

router
  .route("/")
  .post(verifyAdministratorOrEditor, createTransportation)
  .get(verifyAdministratorOrEditor, getTransportation)
  .delete(verifyAdministratorOrEditor, removeTransportation)
  .put(verifyAdministratorOrEditor, updateTransportation);

router
  .route("/spending/:name/:type/:phone")
  .post(verifyAdministratorOrEditor, addSpending)
  .put(verifyAdministratorOrEditor, updateSpending);

//.put(verifyAdministratorOrEditor,updateSpending)
//.delete(verifyAdministratorOrEditor, removeSpending)
//.get(verifyAdministratorOrEditor, listSpending)
//Queries
// Filter spending by date
// Filter spending by user
// Filter spending by amount
// Filter spending by type

module.exports = router;
