const mongoose = require('mongoose');
const express = require('express');
const wsModule = require('ws');

const { database } = require('./consfig');
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


// Port setting
var port = 52277;
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
  // ws.send('서버에서 클라이언트로');

  ws.on('message', (msg) => {
      console.log(`수신: \n${msg}`);

      try{
          // 매수: 0, 매도: 1, 보류: 2
          let log = JSON.parse(msg)
          if (log['type'] == 0) log['type'] = "매수"
          else if (log['type'] == 1) log['type'] = "매도"
          else if (log['type'] == 2) log['type'] = "보류"
          else throw "log type err"

          log['auto'] = true;
          if (log['type'] == "매수" || log['type'] == "매도" || log['type'] == "보류"){
            TradeLog.create(log, (err, contact) => {
              if (err) console.error(err);
            });

            Asset.findOne({id: 1}).exec()
            .then(instance => {
              if (log['type'] == "매수") {
                instance['availAble'] -= log['amount'] + log['fee'];
                instance['totalAssets'] = instance['availAble'];
                instance['quantity'] += log['volume'];
                if (instance['avgPrice'] == 0) instance['avgPrice'] = log['price'];
                else instance['avgPrice'] = Math.round((instance['avgPrice'] + log['price']) / instance['quantity'] * 100) / 100;
              }
              else if (log['type'] == "매도") {
                instance['availAble'] += log['amount'] - log['fee'];
                instance['totalAssets'] = instance['availAble'];
                instance['quantity'] -= log['volume'];
                if (instance['quantity'] == 0) instance['avgPrice'] = 0
              }
    
              return instance;
            })
            .then(instance => {
              Asset.updateOne({id: 1}, instance).exec();
            })
            .catch(err => console.error(err));
          }
      }catch(err){
        console.error('try-catch err:' + err);
      }
  });

  ws.on('error', err => {
      console.error(err);
  });

  ws.on('close', () => {
      console.log(`WS: ${ip} 연결해제`);
  });
});

