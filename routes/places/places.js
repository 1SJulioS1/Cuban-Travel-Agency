const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");

const {
  createPlace,
  updatePlace,
  removePlace,
  getPlace,
} = require("../../controllers/places/placesController");

router
  .route("/")
  .post(verifyAdministratorOrEditor, createPlace)
  .get(getPlace)
  .delete(verifyAdministratorOrEditor, removePlace)
  .put(verifyAdministratorOrEditor, updatePlace);

module.exports = router;
