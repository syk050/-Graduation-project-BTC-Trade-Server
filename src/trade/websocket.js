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

client.on('connect', function(connection){
    console.log('WebSocket Client Connected');
    connection.on('error', function(error){
        console.log(`Connection: ${error.toString()}`);
    });

    connection.on('close', function(){
        console.log('cho-protocol Connection Closed');
        // initWebsocket();
    });

    connection.on('message', function(message){
        const jsonData = JSON.parse(message['utf8Data']);
        const data = jsonData['data'];

        if(!isEmptyObject(data)){
            console.log(`timestamp: ${data['timestamp']}, amount: ${data['amount']}, type: ${data['type']?'매도':'매수'}(${data['type']})`);

            if(data['type'] === 0){  //매수
                amount += data['amount']
            }else{  // 매도
                amount -= data['amount'];
            }

            console.log(amount);
        }
    });

    function initWebsocket(){
        connection.send(JSON.stringify(subscribeMsg));
    }

    initWebsocket();
});


const { Worker } = require('worker_threads');

const worker = new Worker('./trade/timecheck.js');

worker.on('message', message => {
    console.log(amount);
    amount = 0;
});

worker.on('exit', () => console.log('worker exit'));
