const express = require("express");
const router = express.Router();
const { createUser } = require("../../controllers/users/userController");
const verifySelfOrAdminstrator = require("../../middleware/verifySelfOrAdministrator");
const verifyAdministrator = require("../../middleware/verifyAdministrator");
const {
  getAllUsersByRole,
} = require("../../controllers/users/adminController");

router.route("/").post(verifyAdministrator, createUser);
router.route("/users").get(verifyAdministrator, getAllUsersByRole);
module.exports = router;
