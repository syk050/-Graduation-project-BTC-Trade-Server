const express = require('express');
const fs = require('fs');

const { port } = require('./config');

const app = express();

// Settings
app.set('view engine', 'ejs');

app.set('port', port);

// Routes
app.use('/upload', require('./routes/upload.route.js'));
app.use('/candles', require('./routes/candles.route'));


const dir = './uploadedFiles';
// fs.existsSync()함수로 폴더가 존재하는지 확인하고, 없으면 fs.mkdirSync()함수로 폴더를 생성해 줍니다.
if(!fs.existsSync(dir)) app.fs.mkdirSync(dir);

module.exports = app;