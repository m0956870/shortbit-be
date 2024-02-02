const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const Transaction = require("../../../../models/transactionModel");

const getWalletDetails = async (req, res, next) => {
    // console.log("getWalletDetails -----------------------", req.body)
    try {
        let { page, limit, type } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;
        let user = req.user;

        if (type === "transaction") {
            let userTransactions = await Transaction.find({ $or: [{ user_id: user._id, transaction_by: 'user' }, { to_user_id: user._id, transaction_by: 'admin' }] })
                .lean()
                .skip((page * limit) - limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate('to_user_id', 'name profile_image')
                .select('transaction_type amount createdAt')

            let userTransactionsData = {}
            userTransactionsData.balance = user.balance
            userTransactionsData.userTransactions = userTransactions

            return res.status(201).json({ status: true, message: 'transaction listing', data: userTransactionsData });
        } else if (type === 'settlement') {
            return res.send('settlement')
        }
        throw new ApiError("give proper type", 400)
    } catch (error) {
        next(error);
    }
}

module.exports = getWalletDetails;