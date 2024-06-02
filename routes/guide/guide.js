const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");
const {
  createGuide,
  getGuide,
  removeGuide,
  updateGuide,
  getGuideTours,
} = require("../../controllers/guide/guideController");
router
  .route("/")
  .post(createGuide)
  .get(getGuide)
  .delete(removeGuide)
  .put(updateGuide);

router.route("/:guideId/tours").get(getGuideTours);
module.exports = router;
