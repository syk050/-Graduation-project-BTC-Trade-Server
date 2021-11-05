const express = require('express');
const router = express.Router();

const { getTrade, postTrade } = require('../controller/trade.controller');


router.get('/', getTrade);
router.post('/', postTrade);



module.exports = router;