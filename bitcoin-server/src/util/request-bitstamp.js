const reqBitstamp = {}

const fetch = require('node-fetch');
const pool = require('../database');
const queryString = require('query-string');
const { Worker } = require('worker_threads');

reqBitstamp.selectLastOne = async function(){
    pool.query('SELECT * FROM price ORDER BY time DESC LIMIT 1')
        .then(result => result[0][0]['time'])
        .then(time => callAPI(time))
        .catch(err => console.log(err))
}

async function callAPI(time){
    console.log(`Last Time: ${new Date(time*1000)}`);

    const url = 'https://www.bitstamp.net/api/v2/ohlc/btcusd/';
    const query = {'step': '60', 'limit': 1000};
    const qurl = queryString.stringifyUrl({url: url, query: query});
    fetch(qurl, {method: 'GET'})
        .then(res => res.json())
        .then(json => findData(json['data']['ohlc'], time))
        .then(data => insert(data))
        .catch(err => console.log(err));
}

function findData(data, time){
    // console.log(`Last Time: ${parseInt(data['ohlc'][0]['timestamp']*1000)}`);

    let idx = -1;
    for(let i=0; i<data.length; i++){
        // JavaScript Timestamp = unixTimestamp * 1000
        if(parseInt(data[i]['timestamp']) == parseInt(time)){
            idx = i;
            break;
        }
    }
    
    if(idx == -1){
        console.log(`data empty: ${new Date(time*1000)} ~ ${new Date (parseInt(data[0]['timestamp'])*1000)}`);

        return data;
    }else{
        return data.slice(idx+1);
    }
}

async function insert(data){
    try{
        console.log(`Insert Time: ${new Date(parseInt(data[0]['timestamp'])*1000)}`);
        // time, open, high, low, close, volume
        // {"high": "", "timestamp": "", "volume": "", "low": "", "close": "", "open": ""}
        const insertData = new Array();
        data.forEach(async (element) => {
            const temp = [
                parseInt(element['timestamp']),
                parseFloat(element['open']),
                parseFloat(element['high']),
                parseFloat(element['low']),
                parseFloat(element['close']),
                parseFloat(element['volume'])
            ];
            insertData.push(temp);
        });


        pool.query('INSERT INTO price (time, open, high, low, close, volume) VALUES ?', [insertData])
            .then(result => startWorker(['ok']))
            .catch(err => console.log(`error: ${err}`));

    }catch(e){
        console.log(e);
        startWorker(['skip']);
    }
}

function startWorker(result){
    console.log(result[0])

    const worker = new Worker(__dirname + '/apiWorker.js');
}

module.exports = reqBitstamp;