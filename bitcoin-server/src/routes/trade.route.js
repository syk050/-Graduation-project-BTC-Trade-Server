const express = require('express');
const router = express.Router();

const { tradeData1M, tradeData10M, tradeData1H } = require('../controller/trade.controller');


router.get('/1m', tradeData1M);
router.get('/10m', tradeData10M);
router.get('/1h', tradeData1H);


module.exports = router;