const tradeCtrl = {};

const pool = require('../database');

/*
 * 1분은 60개 데이터 
 * 10분은 6개 데이터 
 * 1시간은 24개 데이터
 */
tradeCtrl.tradeData1M = async function(req, res){
    const uTime = parseInt(Date.now() / 1000);
    const from = new Date((uTime - (uTime % 60)) - (60*60)).format("yyyy-MM-dd hh:mm:ss");
    const to = new Date(uTime - (uTime % 60)).format("yyyy-MM-dd hh:mm:ss");

    const searchSql = 'SELECT * \
                        FROM ( \
                            SELECT * \
                            FROM trade \
                            WHERE time BETWEEN ? AND ? \
                            ORDER BY time DESC \
                            limit 60 \
                        ) As B \
                        order by B.time;';
    const result = await pool.query(searchSql, [from, to]);

    res.render('trade-table', {
        list: result[0]
    });
};

tradeCtrl.tradeData10M = async function(req, res){
    const uTime = parseInt(Date.now() / 1000);
    const from = new Date((uTime - (uTime % 60)) - (60*60)).format("yyyy-MM-dd hh:mm:ss");
    const to = new Date(uTime - (uTime % 60)).format("yyyy-MM-dd hh:mm:ss");

    const searchSql = "SELECT time, \
                            price, \
                            sum(amount) AS 'amount', \
                            sum(total_amount) As 'total_amount' \
                        FROM trade \
                        WHERE time BETWEEN ? AND ? \
                        GROUP BY SUBSTR(date_format(time, '%Y%m%d%H%i%S'), 1, 10);";
                        
    const searchResult = await pool.query(searchSql, [from, to]);

    res.render('trade-table', {
        list: searchResult[0]
    });
};

tradeCtrl.tradeData1H = async function(req, res){
    const uTime = parseInt(Date.now() / 1000);
    const from = new Date((uTime - (uTime % 3600)) - 3600*23).format("yyyy-MM-dd hh:mm:ss");
    const to = new Date(uTime - (uTime % 3600)).format("yyyy-MM-dd hh:mm:ss");

    const searchSql = "SELECT time, \
                        price, \
                        sum(amount) AS 'amount', \
                        sum(total_amount) As 'total_amount' \
                    FROM trade \
                    WHERE time BETWEEN ? AND ? \
                    GROUP BY SUBSTR(date_format(time, '%Y%m%d%H%i%S'), 1, 11);";
    const searchResult = await pool.query(searchSql, [from, to]);

    res.render('trade-table', {
        list: searchResult[0]
    });
};

module.exports = tradeCtrl;
