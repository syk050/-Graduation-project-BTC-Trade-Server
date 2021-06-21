const app = require('./app');
const req = require('./util/request-bitstamp');
const {execute} = require('./util/modelExec');


app.listen(app.get('port'));
console.log('Server is in port', app.get('port'));

// req.selectLastOne();
execute();
