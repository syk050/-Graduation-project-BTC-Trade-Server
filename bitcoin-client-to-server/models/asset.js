const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    id: Number,
    availAble: Number,
    totalAssets: Number,
    quantity: Number,
    avgPrice: Number,
    purchase: Number,
    valuation: Number,
    profitAndLoss: Number,
    yield: Number
});


module.exports = mongoose.model('asset', assetSchema);

/* 자산         
 * 보유 KRW     availAble: Number
 * 총 보유자산  totalAssets: Number,
 * 보유수량     quantity: Number,
 * 매수평균가   avgPrice: Number,
 * 매수금액     purchase: Number
 * 평가금액     valuation: Number,
 * 평가손익     profitAndLoss: Number,
 * 수익률       yield: Number
 */

// {
//     "availAble": 1,
//     "totalAssets": 2,
//     "quantity": 3,
//     "avgPrice": 4,
//     "purchase": 5,
//     "valuation": 6,
//     "profitAndLoss": 7,
//     "yield": 8
// }