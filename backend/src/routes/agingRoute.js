const express = require("express");
const router = express.Router();
const agingController = require("../controllers/agingController");

router.post("/init", agingController.init);
router.post("/reInit", agingController.reInit);
module.exports = router;
