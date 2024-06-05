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
  .post(verifyAdministratorOrEditor, createTour)
  .get(getTour)
  .delete(verifyAdministratorOrEditor, removeTour)
  .put(verifyAdministratorOrEditor, updateTour);
module.exports = router;
