
const candlesCtrl = {};

const pool = require('../database');

candlesCtrl.process1M = async function(req, res){

    let limit = Math.max(1, parseInt(req.query.limit));
    limit = !isNaN(limit)?limit:1000;

    const searchSql = 'SELECT * FROM price ORDER BY time DESC LIMIT ?;';
    const result = await pool.query(searchSql, limit);

    res.render('price-table', {
        list: result[0]
    });
};

candlesCtrl.process10M = async function(req, res){

    let limit = Math.max(1, parseInt(req.query.limit));
    limit = !isNaN(limit)?limit:1000;

    const searchSql = "SELECT time, \
                            open, \
                            max(high) AS 'High', \
                            min(low) As 'Low'\
                        FROM bitcoin.price \
                        GROUP BY floor(time / 600) \
                        order by time DESC \
                        limit ?;"
    const searchResult = await pool.query(searchSql, limit);

    const closeSql = "SELECT close \
                        FROM bitcoin.price \
                        WHERE time IN ( \
                            SELECT MAX(time) \
                            FROM bitcoin.price \
                            GROUP BY floor(time / 600) \
                        ) \
                        ORDER BY time DESC \
                        LIMIT ?;"
    
    const closeResult = await pool.query(closeSql, limit);

    for (let i=0; i<limit; i++){
        searchResult[0][i]['close'] = closeResult[0][i]['close'];
    }

    res.render('price-table', {
        list: searchResult[0]
    });
};

candlesCtrl.process1H = async function(req, res){

    let limit = Math.max(1, parseInt(req.query.limit));
    limit = !isNaN(limit)?limit:1000;

    const searchSql = "SELECT time, \
                            open, \
                            max(high) AS 'High', \
                            min(low) As 'Low'\
                        FROM bitcoin.price \
                        GROUP BY floor(time / 3600) \
                        order by time DESC \
                        limit ?;"
    const searchResult = await pool.query(searchSql, limit);

    const closeSql = "SELECT close \
                        FROM bitcoin.price \
                        WHERE time IN ( \
                            SELECT MAX(time) \
                            FROM bitcoin.price \
                            GROUP BY floor(time / 3600) \
                        ) \
                        ORDER BY time DESC \
                        LIMIT ?;"
    
    const closeResult = await pool.query(closeSql, limit);

    for (let i=0; i<limit; i++){
        searchResult[0][i]['close'] = closeResult[0][i]['close'];
    }

    res.render('price-table', {
        list: searchResult[0]
    });
};

module.exports = candlesCtrl;
// group by substr 
// group by - ?