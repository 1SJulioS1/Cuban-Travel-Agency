const express = require("express");
const router = express.Router();
const verifySelfOrAdminstrator = require("../../middleware/verifySelfOrAdministrator");
const verifyAdministrator = require("../../middleware/verifyAdministrator");
const {
  createUser,
  getUser,
  updateUser,
} = require("../../controllers/users/userController");
const {
  getAllUsersByRole,
} = require("../../controllers/users/adminController");

router.route("/").post(verifyAdministrator, createUser);
router.route("/users").get(verifyAdministrator, getAllUsersByRole);
router
  .route("/:id")
  .get(verifyAdministrator, getUser)
  .put(verifyAdministrator, updateUser);
module.exports = router;
