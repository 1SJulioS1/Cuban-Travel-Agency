const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");

const {
  createPlace,
  updatePlace,
  removePlace,
} = require("../../controllers/places/placesController");

router.route("/").post(verifyAdministratorOrEditor, createPlace);
router.route("/:name").put(verifyAdministratorOrEditor, updatePlace);
router.route("/:name").delete(verifyAdministratorOrEditor, removePlace);
module.exports = router;
