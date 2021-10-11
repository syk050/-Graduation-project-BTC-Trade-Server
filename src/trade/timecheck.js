const { parentPort } = require('worker_threads');


setInterval(function() {
    var date = new Date();
    if ( date.getSeconds() === 0 ) {
        parentPort.postMessage(date);
    }
  }, 1000);
