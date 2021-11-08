const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const wsModule = require('ws');

const { database } = require('./config');

const Asset = require('./models/asset');
const TradeLog = require('./models/trade-log');


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
const HTTPServer = app.listen(port, () => {
  console.log('Sever is opren at port: ' + port);
});

const webSocketServer = new wsModule.Server({
  server: HTTPServer,
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

    
    try{
      let log = JSON.parse(msg)

      if (log['type'] == 0){  // 매수
        log['type'] = "매수"
      }else if(log['type'] == 1){  // 매도
        log['type'] = "매도"
      }else if(log['type'] == 2){   // 자동 매매
        
      }else{
        throw "log['type'] err";
      }
      log['auto'] = false;
      if (log['type'] == 0 || log['type'] == 1){
        TradeLog.create(log, (err, contact) => {
          if (err) console.error(err);
        });
      }
      
      Asset.findOne({id: 1}).exec()
        .then(instance => {
          if (log['type'] == 0) {
            instance['availAble'] -= msg['amount'] + msg['fee'];
            instance['totalAssets'] = instance['availAble'];
            instance['quantity'] += msg['volume'];
            instance['avgPrice'] = Math.round((instance['avgPrice'] + msg['price']) / instance['quantity'] * 100) / 100;
          }
          else if (log['type'] == 1) {
            instance['availAble'] += msg['amount'] - msg['fee'];
            instance['totalAssets'] = instance['availAble'];
            instance['quantity'] -= msg['volume'];
          }

          return instance;
        })
        .then(instance => {
          Asset.updateOne({id: 1}, instance).exec();
        })
        .catch(err => console.error(err));
        
    }catch(err){
      console.log('ws-client err');
      console.error(err);
    }
  });

  ws.on('error', err => {
    console.log('ws-client err');
    console.error(err);
  });

  ws.on('close', () => {
    console.log(`WS: ${ip} 연결해제`);
  });
});
