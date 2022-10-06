const express = require('express');
const router = express.Router();

const { fileRequest10M, fileRequest1M, fileRequest1H } = require('../controller/file.controller');


router.get('/1m', fileRequest1M);
router.get('/10m', fileRequest10M);
router.get('/1h', fileRequest1H);


module.exports = router;