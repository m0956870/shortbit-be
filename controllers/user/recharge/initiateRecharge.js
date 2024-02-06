const Transaction = require("../../../models/transactionModel");

const initiateRecharge = async (req, res, next) => {
    // console.log("initiateRecharge -----------------------", req.body)
    try {
        let { amount } = req.body;
        let user = req.user;

        // desc balance in user account
        let userTransaction = await Transaction.create({
            user_id: user._id,
            transaction_type: 'credit',
            transaction_by: 'user',
            item_type: 'recharge',
            amount
        });
        user.balance = user.balance + amount;
        user.save();

        res.status(201).json({ status: true, message: 'recharge successful' });
    } catch (error) {
        next(error);
    }
}

module.exports = initiateRecharge;