const express = require("express");
const router = express.Router();

// 1. 기능별 라우터 불러오기
const mainRoute = require("./mainRoute");
const agingRoute = require("./agingRoute");
const resultRoute = require("./resultRoute");
// '/api/v1' 뒤에 '/auth'가 붙습니다.
router.use("/main", mainRoute);
router.use("/aging", agingRoute);
router.use("/result", resultRoute);
module.exports = router;
