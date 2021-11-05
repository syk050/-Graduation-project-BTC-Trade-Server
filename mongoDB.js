const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const wsModule = require('ws');

const { database } = require('./consfig')


mongoose.connect(database);
const db = mongoose.connection;

db.once('open', function(){
  console.log('DB connected');
});

db.on('error', function(err){
  console.log('DB ERROR : ', err);
});


const app = express();
// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json()); // json 형태로 받음
app.use(bodyParser.urlencoded({extended:true})); // 3

// Route
app.use('/info', require('./routes/info.route'));
app.use('/trade', require('./routes/trade.route'));


// Port setting
var port = 52276;
app.listen(port, function(){
  console.log('server on! ' + port);
});

const webSocketServer = new wsModule.Server({
  server: app,
});

webSocketServer.on('connection', (ws, req) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`WS: ${ip} 접속`);

  if (ws.readyState == ws.OPEN){
      ws.send('ws-server 접속 완료');
      console.log(`WS: ${ip} 접속 완료`);
  }

  ws.on('message', (msg) => {
      console.log(`수신: \n${msg}`);
  });

  ws.on('error', err => {
      console.error(err);
  });

  ws.on('close', () => {
      console.log(`WS: ${ip} 연결해제`);
  });
});

