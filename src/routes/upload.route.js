const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploadedFiles/');
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}__${file.originalname}`);
    }
});
// 파일의 이름을 유지
const originalFilename = multer({ storage: storage });

router.get('/', function(req, res){
    res.render('upload');
});

router.post('/originalFilename', originalFilename.single('attachment'), function(req, res){
    res.render('confirmation', { file:req.file, files:null });
});
router.post('/originalFilename', originalFilename.array('attachments'), function(req, res){
    res.render('confirmation', { file:req.file, files:null });
});

module.exports = router;