const { isValidObjectId } = require("mongoose");
const User = require('../../../../models/userModel');
const Transaction = require('../../../../models/transactionModel');
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");

let TypeEnum = ['credit', 'debit'];

const updateBalance = async (req, res, next) => {
    // console.log("updateBalance ----------------------", req.body)
    try {
        let { user_id, type, amount } = req.body;
        if (!user_id) throw new ApiError("user id is required", 400)
        if (!isValidObjectId(user_id)) throw new ApiError("Invalid ID format", 400);
        if (!type) throw new ApiError("type is required", 400)
        if (!TypeEnum.includes(type)) throw new ApiError("invalid type", 400)
        if (!amount) throw new ApiError("amount is required", 400)
        // else amount = Number(amount);
        let admin = req.user;

        if (type === 'credit') {
            await Transaction.create({
                user_id: admin._id,
                to_user_id: user_id,
                transaction_type: type,
                transaction_by: 'admin',
                amount: amount,
                item_type: 'coin'
            });

            let updated = await User.findByIdAndUpdate(user_id, { $inc: { balance: +amount } }, { new: true });
            if (!updated) throw new ApiError("no user found with this ID", 404);

            return res.status(200).json({ status: true, message: 'balance updated successfully', data: updated });
        } else {
            // check for user negative balance
            let user = await User.findById(user_id);
            if (!user) throw new ApiError("no user found with this ID", 404);

            console.log(amount, user.balance, amount > user.balance);
            if (amount > user.balance) {
                amount = user.balance;
                await Transaction.create({
                    user_id: admin._id,
                    to_user_id: user_id,
                    transaction_type: type,
                    transaction_by: 'admin',
                    amount: amount,
                    item_type: 'coin'
                });
                let updated = await User.findByIdAndUpdate(user_id, { $inc: { balance: -amount } }, { new: true });
                return res.status(200).json({ status: true, message: 'balance updated successfully', data: updated });
            } else {
                await Transaction.create({
                    user_id: admin._id,
                    to_user_id: user_id,
                    transaction_type: type,
                    transaction_by: 'admin',
                    amount: amount,
                    item_type: 'coin'
                });
                let updated = await User.findByIdAndUpdate(user_id, { $inc: { balance: -amount } }, { new: true });
                return res.status(200).json({ status: true, message: 'balance updated successfully', data: updated });
            }
        }
    } catch (error) {
        next(error)
    }
}

module.exports = updateBalance;