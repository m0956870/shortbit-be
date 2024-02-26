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
        let videoChat = await VideoChat.findById(chat_id).populate('user_id host_id', 'name profile_image followers_count balance price_per_min')
        if (!videoChat) throw new ApiError('No video chat find with this id', 404);
        if (videoChat.status === 'ended') throw new ApiError('video chat has ended', 400);
        let rootUser = req.user;
        if (rootUser._id.toString() !== videoChat.user_id._id.toString()) throw new ApiError('call not initiated by user', 400);

        if (type === 'host_cancel') {
            videoChat.status = 'ended';
            videoChat.chat_status = 'host_cancel';
            videoChat.save();
            return res.status(200).json({ status: true, message: "video chat ended", data: videoChat });

        } else if (type === 'host_accepted') {
            if (videoChat.status === 'ongoing') throw new ApiError('video chat is already ongoing', 400);

            if (videoChat.host_id.price_per_min > rootUser.balance) throw new ApiError('user balance is low', 404);

            let maxMin = Math.ceil(rootUser.balance / videoChat.host_id.price_per_min)

            videoChat.status = 'ongoing';
            videoChat.chat_status = 'host_accepted';
            videoChat.start_time = Date.now();
            videoChat.max_min = maxMin;

            videoChat.save();
            return res.status(200).json({ status: true, message: "video chat started", data: videoChat });

        } else if (type === 'host_end' || type === 'user_end') {
            let host = await User.findById(videoChat.host_id._id);

            let differenceMin = ((new Date().getTime() - Number(videoChat.start_time)) / 1000) / 60;
            differenceMin = Math.abs(Math.round(differenceMin)) + 1;

            let amount = differenceMin * videoChat.host_id.price_per_min;

            // create user txn
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

            // create host txn
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

            videoChat.end_time = Date.now();
            videoChat.status = 'ended';
            videoChat.chat_status = type;
            videoChat.total_time_in_minutes = differenceMin;
            videoChat.user_transaction_id = userTransaction._id;
            videoChat.host_transaction_id = hostTransaction._id;
            videoChat.save();

            return res.status(200).json({ status: true, message: "video chat ended", data: videoChat });
        }
        throw new ApiError('invalid type', 404)
    } catch (error) {
        next(error);
    }
}

module.exports = updateVideoChat;