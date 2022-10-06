const modelExec = {}

const { spawn } = require('child_process');
const path = require('path');


modelExec.execute = () => {
    filePath = path.join(__dirname, '/../py/code/test_prototype_2.py');
    // filePath = path.join(__dirname, '/../py/spawnTest.py');
    // console.log(filePath);

    const model = spawn('python', [filePath, '1m']);
    model.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    model.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    model.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    model.on('error', (error => {
        console.log(`error: ${error.message}`);
    }))
}


module.exports = modelExec;