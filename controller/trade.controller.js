const tradeCtrl = {};

const tradeLog = require('../models/trade-log');

tradeCtrl.getTrade = async function(req, res){
    tradeLog.find({})
      .sort('{timestamp: -1}')
      .exec((err, logs) => {
        if (err) return res.json(err);
  
        res.send(logs);
    });
};

tradeCtrl.postTrade = async function(req, res){
    tradeLog.create(req.body, (err, contact) => {
        if (err) return res.json(err);
        res.redirect("/");
    });
};

module.exports = tradeCtrl;