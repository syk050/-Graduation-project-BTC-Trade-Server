const fileCtrl = {};

const xlsx = require('xlsx');
const fs = require('fs');

const pool = require('../database');
const { saveJsonToCSV } = require('../util/dataExports');

/*
 * 1분은 60개 데이터 
 * 10분은 6개 데이터 
 * 1시간은 24개 데이터
 */
fileCtrl.fileRequest1M = async function(req, res){
    const uTime = Date.now();
    
    const fromTimestamp = (uTime - (uTime % 60000)) - (60*60000);
    const toTimestamp = uTime - (uTime % 60000)

    const fromTemp = new Date(fromTimestamp).toISOString().split('T');
    const from = `${fromTemp[0]} ${fromTemp[1].slice(0,8)}`;

    const toTemp = new Date(toTimestamp).toISOString().split('T');
    const to = `${toTemp[0]} ${toTemp[1].slice(0,8)}`;

    const searchSql = 'SELECT * \
                        FROM ( \
                            SELECT * \
                            FROM price \
                            WHERE time BETWEEN ? AND ? \
                            ORDER BY time DESC \
                            limit 60 \
                        ) As B \
                        order by B.time;';
    const result = await pool.query(searchSql, [from, to]);

    // const fileName = `${from}-${to}-1m`;
    // saveJsonToCSV(result[0], fileName);
    // res.send(result[0])
    res.render('price-table', {
        list: result[0]
    });
};

fileCtrl.fileRequest10M = async function(req, res){
    const uTime = Date.now();
    // const from = new Date((uTime - (uTime % 60)) - (60*60)).format("yyyy-MM-dd hh:mm:ss");
    // const to = new Date(uTime - (uTime % 60)).format("yyyy-MM-dd hh:mm:ss");

    const fromTimestamp = (uTime - (uTime % 60000)) - (60*60000);
    const toTimestamp = uTime - (uTime % 60000)

    const fromTemp = new Date(fromTimestamp).toISOString().split('T');
    const from = `${fromTemp[0]} ${fromTemp[1].slice(0,8)}`;

    const toTemp = new Date(toTimestamp).toISOString().split('T');
    const to = `${toTemp[0]} ${toTemp[1].slice(0,8)}`;

    const searchSql = "SELECT time, \
                            open, \
                            max(high) AS 'High', \
                            min(low) As 'Low',\
                            close, \
                            sum(volume) As 'volume' \
                        FROM price \
                        WHERE time BETWEEN ? AND ? \
                        GROUP BY SUBSTR(date_format(time, '%Y%m%d%H%i%S'), 1, 11);";
                        
    const searchResult = await pool.query(searchSql, [from, to]);

    const closeSql = "SELECT close \
                        FROM price \
                        WHERE time IN ( \
                            SELECT MAX(time) \
                            FROM price \
                            WHERE time BETWEEN ? AND ? \
                            GROUP BY SUBSTR(date_format(time, '%Y%m%d%H%i%S'), 1, 11) \
                        );";
    const closeResult = await pool.query(closeSql, [from, to]);

    for (let i=0; i<6; i++){
        searchResult[0][i]['close'] = closeResult[0][i]['close'];
    }

    // const fileName = `${from}-${to}-10m`;
    // saveJsonToCSV(searchResult[0], fileName);
    // res.redirect(`/${fileName}.csv`);
    res.render('price-table', {
        list: searchResult[0]
    });
};

fileCtrl.fileRequest1H = async function(req, res){
    const uTime = Date.now();
    // const from = new Date((uTime - (uTime % 3600)) - 3600*23).format("yyyy-MM-dd hh:mm:ss");
    // const to = new Date(uTime - (uTime % 3600)).format("yyyy-MM-dd hh:mm:ss");

    const fromTimestamp = (uTime - (uTime % 3600000)) - (23*3600000);
    const toTimestamp = uTime - (uTime % 3600000)

    const fromTemp = new Date(fromTimestamp).toISOString().split('T');
    const from = `${fromTemp[0]} ${fromTemp[1].slice(0,8)}`;

    const toTemp = new Date(toTimestamp).toISOString().split('T');
    const to = `${toTemp[0]} ${toTemp[1].slice(0,8)}`;

    const searchSql = "SELECT time, \
                        open, \
                        max(high) AS 'High', \
                        min(low) As 'Low',\
                        close, \
                        sum(volume) As 'volume' \
                    FROM price \
                    WHERE time BETWEEN ? AND ? \
                    GROUP BY SUBSTR(date_format(time, '%Y%m%d%H%i%S'), 1, 10);";
    const searchResult = await pool.query(searchSql, [from, to]);

    const closeSql = "SELECT close \
                    FROM price \
                    WHERE time IN ( \
                        SELECT MAX(time) \
                        FROM price \
                        WHERE time BETWEEN ? AND ? \
                        GROUP BY SUBSTR(date_format(time, '%Y%m%d%H%i%S'), 1, 10) \
                    );";
    const closeResult = await pool.query(closeSql, [from, to]);

    for (let i=0; i<24; i++){
        searchResult[0][i]['close'] = closeResult[0][i]['close'];
    }

    // const fileName = `${from}-${to}-1h`;
    // saveJsonToCSV(searchResult[0], fileName);
    // res.redirect(`/${fileName}.csv`);

    res.render('price-table', {
        list: searchResult[0]
    });
};

module.exports = fileCtrl;
