const tradeCtrl = {};

const pool = require('../database');

/*
 * 1분은 60개 데이터 
 * 10분은 6개 데이터 
 * 1시간은 24개 데이터
 */
tradeCtrl.tradeData1M = async function(req, res){
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
    const uTime = Date.now();

    const fromTimestamp = (uTime - (uTime % 60000)) - (60*60000);
    const toTimestamp = uTime - (uTime % 60000)

    const fromTemp = new Date(fromTimestamp).toISOString().split('T');
    const from = `${fromTemp[0]} ${fromTemp[1].slice(0,8)}`;

    const toTemp = new Date(toTimestamp).toISOString().split('T');
    const to = `${toTemp[0]} ${toTemp[1].slice(0,8)}`;

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

tradeCtrl.tradeData1H = async function(req, res){
    const uTime = Date.now();
    
    const fromTimestamp = (uTime - (uTime % 3600000)) - (23*3600000);
    const toTimestamp = uTime - (uTime % 3600000)

    const fromTemp = new Date(fromTimestamp).toISOString().split('T');
    const from = `${fromTemp[0]} ${fromTemp[1].slice(0,8)}`;

    const toTemp = new Date(toTimestamp).toISOString().split('T');
    const to = `${toTemp[0]} ${toTemp[1].slice(0,8)}`;

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

module.exports = tradeCtrl;
