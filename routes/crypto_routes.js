const express = require("express");
const router = express.Router();

const priceController = require("../services/price-service/controller/price_controller");

router.post("/price",priceController.getPrice);

module.exports = router;