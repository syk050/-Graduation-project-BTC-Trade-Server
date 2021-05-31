const dataExports = {}

const xlsx = require('xlsx');
const fs = require('fs');

dataExports.saveJsonToCSV = (data, fileName) => {
    try{
        console.log(data.length);
        const book = xlsx.utils.book_new();
        const workSheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(book, workSheet, '1m');
        xlsx.writeFile(book, __dirname + '/../temp/' + fileName + '.csv');
    }catch(err){
        console.log(err);
    }
}

module.exports = dataExports;
// xlsx -> csv