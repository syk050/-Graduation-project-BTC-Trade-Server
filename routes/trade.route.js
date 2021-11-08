const express = require('express');
const router = express.Router();

const { getAI, getTotal } = require('../controller/trade.controller');


router.get('/AI', getAI);
router.post('/Total', getTotal);



module.exports = router;