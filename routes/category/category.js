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
  .post(verifyAdministratorOrEditor, createCategory)
  .get(getCategory)
  .delete(verifyAdministratorOrEditor, removeCategory)
  .put(verifyAdministratorOrEditor, updateCategory);
module.exports = router;
