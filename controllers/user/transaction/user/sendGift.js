const { isValidObjectId } = require("mongoose");
const Transaction = require("../../../../models/transactionModel");
const Gift = require("../../../../models/giftModel");
const User = require("../../../../models/userModel");
const LiveRoom = require("../../../../models/liveRoomModel");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");

const sendGift = async (req, res, next) => {
    // console.log("sendGift -----------------------", req.body)
    try {
        let { room_id, to_user_id, gift_id } = req.body
        if (!to_user_id) throw new ApiError("to user id is required", 400)
        if (!isValidObjectId(to_user_id)) throw new ApiError("Invalid host ID format", 400);
        if (!gift_id) throw new ApiError("gift id is required", 400)
        if (!isValidObjectId(gift_id)) throw new ApiError("Invalid gift ID format", 400);
        let host = await User.findById(to_user_id);
        if (!host) throw new ApiError("no host found with this id", 400)
        let user = req.user;

        let gift = await Gift.findById(gift_id);
        if (!gift) throw new ApiError("no gift found with this id", 400)
        if (user.balance < gift.coins) throw new ApiError('Insufficient balance', 400);

        // desc balance in user account
        let userTransaction = await Transaction.create({
            user_id: user._id,
            to_user_id,
            transaction_type: 'debit',
            transaction_by: 'user',
            item_type: 'gift',
            item: gift,
            amount: gift.coins
        });
        user.balance = user.balance - gift.coins;
        user.save();

        // inc balance in host account
        let hostTransaction = await Transaction.create({
            user_id: to_user_id,
            to_user_id: user._id,
            transaction_type: 'credit',
            transaction_by: 'user',
            item_type: 'gift',
            item: gift,
            amount: gift.coins
        });
        // await User.findByIdAndUpdate(to_user_id, { $inc: { balance: +gift.coins } }, { new: true });
        host.balance = host.balance + gift.coins;
        host.save();
        
        // inc liveroom host earning
        let liveRoom = await LiveRoom.findByIdAndUpdate(room_id, { $inc: { earned_coins: +gift.coins } }, { new: true });
        res.status(201).json({ status: true, message: 'gift sent' });
    } catch (error) {
        next(error);
    }
}

module.exports = sendGift;