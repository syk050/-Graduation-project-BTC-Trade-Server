const infoCtrl = {};

const Asset = require('../models/asset');

infoCtrl.getInfo = async function(req, res){
    Asset.find({}, (err, contacts) => {
        if (err) return res.json(err);
    
        res.send(contacts);
    });
};

infoCtrl.postInfo = async function(req, res){
    Asset.create(req.body, (err, contact) => {
        if (err) return res.json(err);
        res.redirect("/info");
    });
};

module.exports = infoCtrl;