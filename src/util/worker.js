const fetch = require('node-fetch');
const pool = require('../database');
const queryString = require('query-string');

async function callAPI(){
    const url = 'https://www.bitstamp.net/api/v2/ohlc/btcusd/';
    const query = {'step': '60', 'limit': 1};
    const qurl = queryString.stringifyUrl({url: url, query: query});
    fetch(qurl, {method: 'GET'})
        .then(res => res.json())
        .then(json => insert(json['data']['ohlc']))
        .catch(err => console.log(err));
}

async function insert(data){
    console.log(`time: ${new Date(parseInt(data[0]['timestamp'])*1000)}`);

    // time, open, high, low, close, volume
    // {"high": "", "timestamp": "", "volume": "", "low": "", "close": "", "open": ""}
    let insertData = new Array();
    data.forEach(element => {
        const temp ={
            time: element['timestamp'],
            open: element['open'],
            high: element['high'],
            low: element['low'],
            close: element['close'],
            volume: element['volume']
        };

        if (temp[volume] == 0){
            console.log(`temp[volume]: ${temp['volume']}`);
            clearInterval(callAPI);
            setTimeout(callAPI, 10000);
            setInterval(callAPI, 60000);
        }else{
            console.log(temp);
            insertData.push(temp);
        }
    });
    
    pool.query('INSERT INTO price SET ?', insertData[0])
        .catch(err => console.log(`error: ${err}`));
}

setInterval(callAPI, 60000);