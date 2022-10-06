const subscribeMsg = {
    "event": "bts:subscribe",
    "data": {
        "channel": "live_trades_btcusd"
    }
};
const unsubscribeMsg = {
    "event": "bts:unsubscribe",
    "data": {
        "channel": "diff_order_book_btcusd"
    }
}
const URL = 'wss://ws.bitstamp.net/'
const isEmptyObject = param => {
    return Object.keys(param).length === 0 && param.constructor === Object;
}

const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();
client.connect(URL);

client.on('connectFailed', function(error){
    console.log(`Connect Error: ${error.toString()}`);
});

let amount = 0;
let total_amount = 0;
const price = new Array();

client.on('connect', function(connection){
    console.log('WebSocket Client Connected');
    connection.on('error', function(error){
        console.log(`Connection: ${error.toString()}`);
    });

    connection.on('close', function(){
        console.log('cho-protocol Connection Closed');
        initWebsocket();
    });

    connection.on('message', function(message){
        const jsonData = JSON.parse(message['utf8Data']);
        const data = jsonData['data'];

        if(!isEmptyObject(data)){
            console.log(`timestamp: ${data['timestamp']}, amount: ${data['amount']}, type: ${data['type']?'매도':'매수'}(${data['type']})`);

            if (data['type']) {  // 매도
                amount -= data['amount'];
            }else{  // 매수
                amount += data['amount'];
            }
            total_amount += data['amount'];
            price.push(data['price']);
        }
    });

    function initWebsocket(){
        connection.send(JSON.stringify(subscribeMsg));
    }

    initWebsocket();
});


const { Worker } = require('worker_threads');
const pool = require('../database');
const worker = new Worker(__dirname + '/timecheck.js');


worker.on('message', date => {
    const day = date.toISOString().split('T')[0];
    const time = date.toISOString().split('T')[1].slice(0, 8);
    
    console.log(`${day} ${time}`);
    console.log(`amount: ${amount},  total_amount: ${total_amount} \n`);

    const timestamp = Math.floor(date.getTime()/1000);
    const totalPrice = price.reduce((sum, num) => { return sum + num }, 0);
    const avg = price.length? totalPrice / price.length : 0;

    const temp ={
	    time: timestamp,
        date: day + ' ' + time,
        price: avg,
        actual_amount: amount,
        total_amount: total_amount
    };

    pool.query('INSERT INTO trade SET ?', temp)
        .catch(err => console.log(`error: ${err}`));

    amount = 0;
    total_amount = 0;
});

worker.on('exit', () => console.log('worker exit'));
