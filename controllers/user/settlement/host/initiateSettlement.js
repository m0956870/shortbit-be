const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const Agency = require("../../../../models/agencyModel");
const Settlement = require("../../../../models/settlementModel");
const Transaction = require("../../../../models/transactionModel");

const initiateSettlement = async (req, res, next) => {
    // console.log("initiateSettlement -----------------------", req.body)
    try {
        let { amount } = req.body;
        if (!amount) throw new ApiError('amount is required', 400)
        if (req.user.role !== 'host' || req.user.account_status !== 'approved') throw new ApiError('user must be approved host', 403)
        if (amount > req.user.balance) throw new ApiError('settlement amount is bigger then wallet balance', 400)

        let agency = await Agency.findOne({ agency_code: req.user.agency_code })

        let settlement = await Settlement.create({
            host_id: req.user._id,
            agency_id: agency._id,
            amount,
        })

        let hostTransaction = await Transaction.create({
            user_id: req.user._id,
            transaction_type: 'debit',
            transaction_by: 'user',
            item_type: 'coin',
            amount,
        });

        req.user.balance = req.user.balance - amount;
        req.user.save();

        return res.status(200).json({ status: true, message: 'settlement requested' });
    } catch (error) {
        next(error);
    }
}

module.exports = initiateSettlement;