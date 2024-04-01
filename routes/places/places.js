const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");

const { createPlace } = require("../../controllers/places/placesController");

router.route("/").post(verifyAdministratorOrEditor, createPlace);

module.exports = router;
