const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Settlement = require('../../../models/settlementModel');
const Transaction = require("../../../models/transactionModel");
const Agency = require("../../../models/agencyModel");
const User = require("../../../models/userModel");

const settlementStatus = ['pending', 'settled'];

const updateSettlement = async (req, res, next) => {
    // console.log("updateSettlement -------------------------->", req.body);
    try {
        let { id, status } = req.body;
        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid ID format!", 400);
        if (!settlementStatus.includes(status)) throw new ApiError("Invalid status!", 400);

        const settlement = await Settlement.findById(id).populate('host_id agency_id')
        if (!settlement) throw new ApiError("No settlement found with this ID", 404);

        let admin = req.user;

        let agencyAmount = (Number(settlement.amount) / 100) * settlement.agency_id.commission;
        let hostAmount = (Number(settlement.amount) / 100) * settlement.host_id.commission;

        // agency transaction
        await Transaction.create({
            user_id: admin._id,
            to_user_id: settlement.agency_id._id,
            transaction_type: 'credit',
            transaction_by: 'admin',
            amount: agencyAmount,
            item_type: 'coin'
        });
        await Agency.findByIdAndUpdate(settlement.agency_id._id, { $inc: { balance: +agencyAmount } }, { new: true })

        // host transaction
        await Transaction.create({
            user_id: admin._id,
            to_user_id: settlement.host_id._id,
            transaction_type: 'credit',
            transaction_by: 'admin',
            amount: hostAmount,
            item_type: 'coin'
        });
        await User.findByIdAndUpdate(settlement.host_id._id, { $inc: { balance: +hostAmount } }, { new: true })

        // console.log("agencyAmount", agencyAmount)
        // console.log("hostAmount", hostAmount)

        let updatedObj = {};
        updatedObj.status = status;

        settlement.status = status;
        settlement.save();

        // const settlement = await Settlement.findByIdAndUpdate(id, updatedObj, { new: true }).lean();
        // if (!settlement) throw new ApiError("No settlement found with this ID", 404);

        res.status(200).json({ status: true, message: "settlement updated", data: settlement });
    } catch (error) {
        next(error);
    }
}

module.exports = updateSettlement;