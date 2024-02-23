const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const VideoChat = require("../../../models/videoChat");
const Transaction = require("../../../models/transactionModel");
const User = require("../../../models/userModel");

const updateVideoChat = async (req, res, next) => {
    // console.log("updateVideoChat -------------------------------->", req.body)
    try {
        let { type, chat_id } = req.body;
        if (!chat_id) throw new ApiError("chat id is required", 400)
        if (!isValidObjectId(chat_id)) throw new ApiError("Invalid chat ID format", 400);
        let videoChat = await VideoChat.findById(chat_id).populate('user_id host_id', 'name profile_image followers_count')
        if (!videoChat) throw new ApiError('No video chat find with this id', 404);
        if (videoChat.status === 'ended') throw new ApiError('video chat has ended', 400);
        let rootUser = req.user;

        if (type === 'host_cancel') {
            videoChat.status = 'ended';
            videoChat.chat_status = 'host_cancel';
            videoChat.save();
            return res.status(200).json({ status: true, message: "video chat ended", data: videoChat });

        } else if (type === 'host_accepted') {
            if (videoChat.status === 'ongoing') throw new ApiError('video chat is already ongoing', 400);

            let host = await User.findById(videoChat.host_id);
            if (host.price_per_min > rootUser.balance) throw new ApiError('user balance is low', 404);

            videoChat.status = 'ongoing';
            videoChat.chat_status = 'host_accepted';
            videoChat.start_time = Date.now();
            videoChat.last_captured_minute = Date.now();
            videoChat.total_time_in_minutes = 1;

            // user txn
            let amount = host.price_per_min;
            let userTransaction = await Transaction.create({
                user_id: rootUser._id,
                to_user_id: host._id,
                transaction_type: 'debit',
                transaction_by: 'user',
                item_type: 'coin',
                amount
            });
            rootUser.balance = rootUser.balance - amount;
            rootUser.save();

            // host txn
            let hostTransaction = await Transaction.create({
                user_id: host._id,
                to_user_id: rootUser._id,
                transaction_type: 'credit',
                transaction_by: 'user',
                item_type: 'coin',
                amount,
            });
            host.balance = host.balance + amount;
            host.save();

            videoChat.user_transaction_id = userTransaction._id;
            videoChat.host_transaction_id = hostTransaction._id;
            videoChat.save();
            return res.status(200).json({ status: true, message: "video chat started", data: videoChat });

        } else if (type === 'user_end') {
            videoChat.end_time = Date.now();
            videoChat.status = 'ended';
            videoChat.chat_status = 'user_end';
            videoChat.save();
            return res.status(200).json({ status: true, message: "video chat ended", data: videoChat });

        } else if (type === 'host_end') {
            videoChat.end_time = Date.now();
            videoChat.status = 'ended';
            videoChat.chat_status = 'host_end';
            videoChat.save();
            return res.status(200).json({ status: true, message: "video chat ended", data: videoChat });
        }

        throw new ApiError('invalid type', 404)
        // return res.status(200).json({ status: true, message: "video chat initiated", data: newVideoChat });
    } catch (error) {
        next(error);
    }
}

module.exports = updateVideoChat;