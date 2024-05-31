const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");
const {
  createRent,
  getRent,
} = require("../../controllers/rent/rentController");
router.route("/").post(verifyAdministratorOrEditor, createRent).get(getRent);
module.exports = router;
