const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");

const {
  createTransportation,
  addSpending,
} = require("../../controllers/transportation/transportationController");

router.route("/").post(verifyAdministratorOrEditor, createTransportation);
router
  .route("/add-spending/:name/:type/:phone")
  .post(verifyAdministratorOrEditor, addSpending);
module.exports = router;
