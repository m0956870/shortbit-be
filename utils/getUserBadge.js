const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
let { ObjectId } = require('bson');
const { USER_BADGES, HOST_BADGES } = require("./constants");

const getUserBadge = async (id) => {
    let user = await User.findById(id);

    // startDate = first date of the month (1) & endDate = end Date of the month (30/31)
    let startDate = new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0)).toLocaleString();
    let endDate = new Date(new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(1))).setHours(0, 0, 0)).toLocaleString();

    if (user.role === 'user') {

        let userTxn = await Transaction.aggregate([
            {
                $match: {
                    user_id: new ObjectId(id),
                    transaction_type: 'debit',
                    transaction_by: 'user',
                    createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) },
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ])
        let userTxnAmount = userTxn[0]?.total || 0;
        user.user_monthly_debit = userTxnAmount;

        let badge = USER_BADGES.filter(badge => userTxnAmount > badge.monthly_debit_limit).at(-1)
        if (userTxnAmount > user.purchased_monthly_debit_limit) user.user_type = badge.type;

    } else if (user.role === 'host') {
        let user = await User.findById(id);

        let userTxn = await Transaction.aggregate([
            {
                $match: {
                    user_id: new ObjectId(id),
                    transaction_type: 'credit',
                    transaction_by: 'user',
                    createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) },
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ])
        let userTxnAmount = userTxn[0]?.total || 0
        user.host_monthly_credit = userTxnAmount;

        let badge = HOST_BADGES.filter(badge => userTxnAmount > badge.monthly_credit_limit).at(-1)
        user.level = badge.type;
    }
    
    user.save();
}

module.exports = getUserBadge;