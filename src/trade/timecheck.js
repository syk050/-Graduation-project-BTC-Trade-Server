const { parentPort } = require('worker_threads');


setInterval(function() {
    var date = new Date();
    if ( date.getSeconds() === 0 ) {
        console.log(date);
        parentPort.postMessage('1m');
    }
  }, 1000);