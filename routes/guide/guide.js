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
  .post(verifyAdministratorOrEditor, createGuide)
  .get(verifyAdministratorOrEditor, getGuide)
  .delete(verifyAdministratorOrEditor, removeGuide)
  .put(verifyAdministratorOrEditor, updateGuide);

router.route("/:guideId/tours").get(getGuideTours);
module.exports = router;
