const express = require("express");
const router = express.Router();

const initialAdminController = require("../controllers/initialAdminController");

router.post("/", initialAdminController.initialAdmin);

module.exports = router;
