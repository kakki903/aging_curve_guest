const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

router.get("/index", mainController.initSite);
module.exports = router;
