const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");
const { createRent } = require("../../controllers/rent/rentController");
router.route("/").post(verifyAdministratorOrEditor, createRent);
module.exports = router;
