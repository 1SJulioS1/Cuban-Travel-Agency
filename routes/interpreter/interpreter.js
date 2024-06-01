const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");
const {
  createInterpreter,
  getInterpreter,
  removeInterpreter,
  updateInterpreter,
} = require("../../controllers/interpreter/interpreterController");
router
  .route("/")
  .post(createInterpreter)
  .get(getInterpreter)
  .delete(verifyAdministratorOrEditor, removeInterpreter)
  .put(verifyAdministratorOrEditor, updateInterpreter);
module.exports = router;
