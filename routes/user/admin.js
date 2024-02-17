const express = require("express");
const router = express.Router();
const { createUser } = require("../../controllers/users/userController");
const verifyAdministrator = require("../../middleware/verifySelfOrAdministrator");

router.route("/").post(verifyAdministrator, createUser);

module.exports = router;
