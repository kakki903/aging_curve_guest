const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

router.get("/:resultId", resultController.getId);
module.exports = router;
