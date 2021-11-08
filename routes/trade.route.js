const express = require('express');
const router = express.Router();

const { getAI, getTotal } = require('../controller/trade.controller');


router.get('/ai', getAI);
router.get('/total', getTotal);



module.exports = router;