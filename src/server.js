const app = require('./app');
const req = require('./util/request-bitstamp');
const { execute } = require('./util/modelExec');
const { Worker } = require('worker_threads');




app.listen(app.get('port'));
console.log('Server is in port', app.get('port'));

req.selectLastOne();
const worker = new Worker('./trade/websocket.js');
// execute();
