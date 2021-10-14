const tradeCtrl = {};

const pool = require('../database');

/*
 * 1분은 60개 데이터 
 * 10분은 6개 데이터 
 * 1시간은 24개 데이터
 */
tradeCtrl.tradeData1M = async function(req, res){
    // let limit = Math.max(1, parseInt(req.query.limit));
    // limit = !isNaN(limit)?limit:60;

    const searchSql = 'SELECT * FROM trade ORDER BY time DESC LIMIT 60;';
    // const result = await pool.query(searchSql, limit);
    const result = await pool.query(searchSql);

    res.render('trade-table', {
        list: result[0]
    });
};

tradeCtrl.tradeData10M = async function(req, res){
    const searchSql = "SELECT time, \
                            date, \
                            AVG(price) AS 'price', \
                            SUM(actual_amount) As 'actual_amount' \
                            SUM(total_amount) As 'total_amount' \
                        FROM trade \
                        GROUP BY floor(time / 600) \
                        order by time DESC \
                        limit 6;"
    const searchResult = await pool.query(searchSql);

    res.render('trade-table', {
        list: searchResult[0]
    });
};

tradeCtrl.tradeData1H = async function(req, res){
    const searchSql = "SELECT time, \
                            date, \
                            AVG(price) AS 'price', \
                            SUM(actual_amount) As 'actual_amount' \
                            SUM(total_amount) As 'total_amount' \
                        FROM trade \
                        GROUP BY floor(time / 3600) \
                        order by time DESC \
                        limit 24;"
    const searchResult = await pool.query(searchSql);
    
    res.render('trade-table', {
        list: searchResult[0]
    });
};

module.exports = tradeCtrl;
