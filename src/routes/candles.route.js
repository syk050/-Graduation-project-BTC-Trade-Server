const express = require('express');
const router = express.Router();

const { process1M, process10M, process1H } = require('../controller/candles.controller');


router.get('/1m', process1M);
router.get('/10m', process10M);
router.get('/1h', process1H);


module.exports = router;