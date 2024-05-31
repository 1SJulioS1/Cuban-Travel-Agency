const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");
const {
  createRent,
  getRent,
  removeRent,
} = require("../../controllers/rent/rentController");
router
  .route("/")
  .post(verifyAdministratorOrEditor, createRent)
  .get(verifyAdministratorOrEditor, getRent)
  .delete(verifyAdministratorOrEditor, removeRent);
module.exports = router;
