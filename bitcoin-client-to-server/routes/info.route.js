const express = require('express');
const router = express.Router();

const { getInfo, postInfo } = require('../controller/info.controller');


router.get('/', getInfo);
router.post('/', postInfo);



module.exports = router;