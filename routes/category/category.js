const express = require("express");
const router = express.Router();
const verifyAdministratorOrEditor = require("../../middleware/verifyAdministratorOrEditor");
const {
  createCategory,
  getCategory,
  removeCategory,
  updateCategory,
} = require("../../controllers/category/categoryController");
router
  .route("/")
  .post(createCategory)
  .get(getCategory)
  .delete(removeCategory)
  .put(updateCategory);
module.exports = router;
