const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");
const {
  createTour,
  getTour,
  removeTour,
  updateTour,
} = require("../../controllers/tour/tourController");
router
  .route("/")
  .post(createTour)
  .get(getTour)
  .delete(removeTour)
  .put(updateTour);
module.exports = router;
