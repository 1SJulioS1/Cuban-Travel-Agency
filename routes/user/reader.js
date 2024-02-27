const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  updateUser,
} = require("../../controllers/users/userController");
const verifySelfOrAdministrator = require("../../middleware/verifySelfOrAdministrator");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .post(createUser)
  .get(verifyJWT, verifySelfOrAdministrator, getUser)
  .put(verifyJWT, verifySelfOrAdministrator, updateUser);

module.exports = router;
