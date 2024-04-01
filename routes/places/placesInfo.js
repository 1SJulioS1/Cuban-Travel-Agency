const express = require("express");
const router = express.Router();

const { getPlace } = require("../../controllers/places/placesController");

router.route("/:name").get(getPlace);

module.exports = router;
