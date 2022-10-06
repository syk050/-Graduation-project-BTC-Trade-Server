const { Worker } = require('worker_threads');
const emptyData = require('./candle/request-bitstamp');

const tradeWorker = new Worker('./trade/websocket.js');
const candleWorker = new Worker('./candle/apiWorker.js');
// const emptyData = new Worker('./candle/request-bitstamp.js');
emptyData.selectLastOne();
