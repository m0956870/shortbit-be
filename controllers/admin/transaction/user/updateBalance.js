const { isValidObjectId } = require("mongoose");
const User = require('../../../../models/userModel');
const Transaction = require('../../../../models/transactionModel');
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");

const updateBalance = async (req, res, next) => {
    // console.log("updateBalance ----------------------", req.body)
    try {
        let { user_id, type, amount } = req.body;
        if (!user_id) throw new ApiError("user id is required", 400)
        if (!isValidObjectId(user_id)) throw new ApiError("Invalid ID format", 400);
        if (!type) throw new ApiError("type is required", 400)
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

            let updated = await User.findByIdAndUpdate(user_id, { $inc: { balance: type === 'credit' ? +amount : -amount } }, { new: true });
            if (!updated) throw new ApiError("no user found with this ID", 404);

            res.status(200).json({ status: true, message: 'balance updated successfully', data: updated });
        } else {
            res.send("debit not implemented")
            // res.status(200).json({ status: true, message: 'balance updated successfully', data: updated });
           
            // check for user negative balance

            // let user = await User.findById(user_id);
            // if (type === 'debit') {
            //     if ((user.balance - amount) < 0) {
            //         amount = 0
            //     }
            // }
        }
    } catch (error) {
        next(error)
    }
}

module.exports = updateBalance;