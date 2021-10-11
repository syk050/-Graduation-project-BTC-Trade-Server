const { parentPort } = require('worker_threads');


setInterval(function() {
    var date = new Date();
    if ( date.getSeconds() === 0 ) {
        date.setMinutes(date.getMinutes() - 1);
        parentPort.postMessage(date);
    }
  }, 1000);