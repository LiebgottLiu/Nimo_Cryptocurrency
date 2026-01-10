const express = require("express");
const router = express.Router();

const priceController = require("../services/price-service/controller/price_controller");
const historyController = require("../services/history-service/controller/history_controller");

router.post("/price",priceController.getPrice);
router.get("/history", historyController.getHistory);


module.exports = router;