const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Transaction = require("../../../models/transactionModel");
const Settlement = require("../../../models/settlementModel");
const User = require("../../../models/userModel");

const getWalletDetails = async (req, res, next) => {
    // console.log("getWalletDetails -----------------------", req.body)
    try {
        let { page, limit, type, user_id } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;
        let user = await User.findById(user_id).lean();
        if (user.is_deleted === true) throw new ApiError("user does not exist", 404);

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

            return res.status(200).json({ status: true, message: 'transaction listing', data: userTransactionsData });
        } else if (type === 'settlement') {
            let userSettlements = await Settlement.find({ host_id: user._id })
                .lean()
                .skip((page * limit) - limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate('host_id', 'name email profile_image phone_number balance')
                .select('-__v')

            let userSettlementData = {}
            userSettlementData.balance = user.balance
            userSettlementData.userSettlements = userSettlements

            return res.status(200).json({ status: true, message: 'settlement listing', data: userSettlementData });
        }
        throw new ApiError("give proper type", 400)
    } catch (error) {
        next(error);
    }
}

module.exports = getWalletDetails;