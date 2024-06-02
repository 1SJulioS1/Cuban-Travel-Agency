const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");
const {
  createInterpreter,
  getInterpreter,
  removeInterpreter,
  updateInterpreter,
  getInterpreterTours,
} = require("../../controllers/interpreter/interpreterController");
router
  .route("/")
  .post(verifyAdministratorOrEditor, createInterpreter)
  .get(getInterpreter)
  .delete(verifyAdministratorOrEditor, removeInterpreter)
  .put(verifyAdministratorOrEditor, updateInterpreter);

router.route("/:interpreterId/tours").get(getInterpreterTours);
module.exports = router;
