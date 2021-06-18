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
    const uTime = parseInt(Date.now() / 1000);
    const from = (uTime - (uTime % 60)) - (60*60);
    const to = uTime - (uTime % 60);

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
    const uTime = parseInt(Date.now() / 1000);
    const from = (uTime - (uTime % 600)) - 600*5;
    const to = uTime - (uTime % 600);

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
    const uTime = parseInt(Date.now() / 1000);
    const from = (uTime - (uTime % 3600)) - 3600*23;
    const to = uTime - (uTime % 3600);

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
