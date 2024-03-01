const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const VideoChat = require("../../../models/videoChat");
const Transaction = require("../../../models/transactionModel");
const User = require("../../../models/userModel");
const getUserBadge = require("../../../utils/getUserBadge");

const videoChatScheduler = async (req, res, next) => {
    // console.log("videoChatScheduler ---------------------------->", req.body)
    try {
        let { chat_id } = req.body;
        if (!chat_id) throw new ApiError("chat id is required", 400)
        if (!isValidObjectId(chat_id)) throw new ApiError("Invalid chat ID format", 400);
        let videoChat = await VideoChat.findById(chat_id).populate('user_id host_id', 'name profile_image followers_count balance price_per_min')
        if (!videoChat) throw new ApiError('No video chat find with this id', 404);
        if (videoChat.status === 'ongoing') throw new ApiError('video chat is not ongoing right now', 400);
        if (videoChat.status === 'ended') throw new ApiError('video chat has ended', 400);

        let rootUser = req.user;
        if (rootUser._id.toString() !== videoChat.user_id._id.toString()) throw new ApiError('video chat not initiated by this user', 400);

        let differenceMin = ((new Date().getTime() - Number(videoChat.start_time)) / 1000) / 60;
        differenceMin = Math.abs(Math.round(differenceMin)) + 1;

        if (differenceMin > videoChat.max_min) {
            let host = await User.findById(videoChat.host_id._id)
            // user txn
            let amount = videoChat.max_min * videoChat.host_id.price_per_min;
            let userTransaction = await Transaction.create({
                user_id: rootUser._id,
                to_user_id: videoChat.host_id._id,
                transaction_type: 'debit',
                transaction_by: 'user',
                item_type: 'coin',
                amount
            });
            rootUser.balance = rootUser.balance - amount;
            rootUser.save();
            getUserBadge(rootUser._id);

            // host txn
            let hostTransaction = await Transaction.create({
                user_id: videoChat.host_id._id,
                to_user_id: rootUser._id,
                transaction_type: 'credit',
                transaction_by: 'user',
                item_type: 'coin',
                amount,
            });
            host.balance = host.balance + amount;
            host.is_video_busy = false;
            host.video_chat_id = null;
            host.save();
            getUserBadge(host._id);

            videoChat.end_time = Date.now();
            videoChat.status = 'ended';
            videoChat.chat_status = "user_end";
            videoChat.total_time_in_minutes = videoChat.max_min;
            videoChat.user_transaction_id = userTransaction._id;
            videoChat.host_transaction_id = hostTransaction._id;
            videoChat.save();

            return res.status(200).json({ status: false, message: "video chat ended" });
        }

        videoChat.last_captured_time = Date.now();
        videoChat.save();

        res.status(200).json({ status: true, message: "call continue" });
    } catch (error) {
        next(error);
    }
}

module.exports = videoChatScheduler;