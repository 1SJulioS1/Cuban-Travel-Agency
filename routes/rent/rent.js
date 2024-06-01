const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");
const {
  createRent,
  getRent,
  removeRent,
  updateRent,
} = require("../../controllers/rent/rentController");
router
  .route("/")
  .post(verifyAdministratorOrEditor, createRent)
  .get(getRent)
  .delete(verifyAdministratorOrEditor, removeRent)
  .put(verifyAdministratorOrEditor, updateRent);
module.exports = router;
S;
