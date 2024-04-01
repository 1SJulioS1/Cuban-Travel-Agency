const express = require("express");
const router = express.Router();

const {
  getPlace,
  getPlaces,
} = require("../../controllers/places/placesController");

router.route("/:name").get(getPlace);
router.route("/").get(getPlaces);

module.exports = router;
