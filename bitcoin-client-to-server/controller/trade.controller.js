const tradeCtrl = {};

const tradeLog = require('../models/trade-log');

// tradeCtrl.getTrade = async function(req, res){
//     tradeLog.find({})
//       .sort('{timestamp: -1}')
//       .exec((err, logs) => {
//         if (err) return res.json(err);
  
//         res.send(logs);
//     });
// };

tradeCtrl.getAI = async function(req, res){
    tradeLog.find({auto: true})
      .sort({timestamp: -1})
      .exec((err, logs) => {
        if (err) return res.json(err);
  
        res.render('trade-log', {logs: logs});
    });
};

tradeCtrl.getTotal = async function(req, res){
    tradeLog.find({})
      .sort({timestamp: -1})
      .exec((err, logs) => {
        if (err) return res.json(err);
  
        res.render('trade-log', {logs: logs});
    });
};

// tradeCtrl.postTrade = async function(req, res){
//     // tradeLog.create(req.body, (err, contact) => {
//     //     if (err) return res.json(err);
//     //     res.redirect("/");
//     // });

//     res.redirect("/");
// };

module.exports = tradeCtrl;