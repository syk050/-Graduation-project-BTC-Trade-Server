const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');


const Asset = require('./models/asset');
const tradeLog = require('./models/trade-log');
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
app.get('/info', (req, res) => {
  Asset.find({}, (err, contacts) => {
    if (err) return res.json(err);

    res.send(contacts);
  });
});

app.post('/info', (req, res) => {
  Asset.create(req.body, (err, contact) => {
    if (err) return res.json(err);
    res.redirect("/");
  });
});

app.get('/trade', (req, res) => {
  tradeLog.find({})
    .sort('{timestamp: -1}')
    .exec((err, logs) => {
      if (err) return res.json(err);

      res.send(logs);
    });
});

app.post('/trade', (req, res) => {
  tradeLog.create(req.body, (err, contact) => {
    if (err) return res.json(err);
    res.redirect("/");
  });
});

// Port setting
var port = 52276;
app.listen(port, function(){
  console.log('server on! ' + port);
});

