const express = require('express');
const fs = require('fs');

const { port } = require('./config');

const app = express();

// Settings
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Routes
app.use('/upload', require('./routes/upload.route'));
app.use('/candles', require('./routes/candles.route'));
app.use('/file', require('./routes/file.route'));
app.use('/trade', require('./routes/trade.route'));


const dir = './uploadedFiles';
// fs.existsSync()함수로 폴더가 존재하는지 확인하고, 없으면 fs.mkdirSync()함수로 폴더를 생성해 줍니다.
if(!fs.existsSync(dir)) app.fs.mkdirSync(dir);

// Public
app.use(express.static(__dirname + '/temp'));

module.exports = app;