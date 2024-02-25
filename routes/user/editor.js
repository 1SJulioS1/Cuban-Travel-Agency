const express = require("express");
const router = express.Router();
const verifySelfOrAdministrator = require("../../middleware/verifySelfOrAdministrator");
const {
  getUser,
  updateUser,
} = require("../../controllers/users/userController");

router
  .route("/:id")
  .get(verifySelfOrAdministrator, getUser)
  .put(verifySelfOrAdministrator, updateUser);

module.exports = router;
