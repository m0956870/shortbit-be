const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const VideoChat = require("../../../models/videoChat");
const Transaction = require("../../../models/transactionModel");
const User = require("../../../models/userModel");
const sendNotification = require("../../../utils/sendNotification");
const getUserBadge = require("../../../utils/getUserBadge");
const LiveRoom = require("../../../models/liveRoomModel");

const updateVideoChat = async (req, res, next) => {
    // console.log("updateVideoChat -------------------------------->", req.body)
    try {
        let { type, chat_id } = req.body;
        if (!chat_id) throw new ApiError("chat id is required", 400)
        if (!isValidObjectId(chat_id)) throw new ApiError("Invalid chat ID format", 400);
        let videoChat = await VideoChat.findById(chat_id).populate('user_id host_id', 'name profile_image followers_count balance price_per_min device_token user_type live_room_id')
        if (!videoChat) throw new ApiError('No video chat find with this id', 404);
        if (videoChat.status === 'ended') throw new ApiError('video chat has ended', 400);
        let rootUser = req.user;

        if (type === 'host_cancel') {
            if (rootUser.role !== 'host' || rootUser.account_status !== 'approved') throw new ApiError("not allowed to cancel videochat", 403);

            videoChat.status = 'ended';
            videoChat.chat_status = 'host_cancel';
            videoChat.save();

            await sendNotification(videoChat.user_id.device_token,
                {
                    body: "Host has cancel your videochat request",
                    title: "Host has cancel your videochat request",
                    type: "host_cancel_video_call",
                },
                {
                    body: "Host has cancel your videochat request",
                    title: "Host has cancel your videochat request",
                    type: "host_cancel_video_call",
                    click_action: '',
                    notification_type: "",
                    user_type: rootUser.user_type,
                    image_url: "",
                    // necessory details
                },
            )
            return res.status(200).json({ status: true, message: "video chat ended", data: videoChat });

        } else if (type === 'host_accepted') {
            if (rootUser.role !== 'host' || rootUser.account_status !== 'approved') throw new ApiError("not allowed to accept videochat", 403);
            if (videoChat.status === 'ongoing') throw new ApiError('video chat is already ongoing', 400);

            if (videoChat.host_id.price_per_min > rootUser.balance) throw new ApiError('user balance is low', 404);

            let maxMin = Math.ceil(videoChat.user_id.balance / videoChat.host_id.price_per_min)

            videoChat.status = 'ongoing';
            videoChat.chat_status = 'host_accepted';
            videoChat.start_time = Date.now();
            videoChat.max_min = maxMin;
            videoChat.save();

            let host = await User.findById(videoChat.host_id)
            if (host.is_deleted === true) throw new ApiError("user does not exist", 404);
            host.is_video_busy = true;
            host.video_chat_id = videoChat._id;
            host.save();

            await sendNotification(videoChat.user_id.device_token,
                {
                    body: "Host has accepted your videochat request",
                    title: "Host has accepted your videochat request",
                    type: "accept_video_call",
                },
                {
                    body: "Host has accepted your videochat request",
                    title: "Host has accepted your videochat request",
                    type: "accept_video_call",
                    click_action: '',
                    notification_type: "",
                    user_type: host.user_type,
                    image_url: "",
                    // necessory details
                },
            )

            let liveRoom = await LiveRoom.findById(videoChat.host_id.live_room_id);

            console.log("videoChat.host_id.live_room_id.", videoChat.host_id.live_room_id)
            if (liveRoom) {
                liveRoom.end_time = Date.now();
                liveRoom.status = 'ended';
                await liveRoom.save()

                rootUser.live_room_id = null;
                rootUser.is_live_busy = false;
                console.log("gfuygu", rootUser)
                await rootUser.save();

                liveRoom.users_token.map(async (user) => {
                    await sendNotification(user.device_token,
                        {
                            body: "Host has ended the chat",
                            title: "liveroom chat ended",
                            type: "live_end",
                            user_type: user.user_type, //vip/normal/vvip/
                        },
                        {
                            body: "Host has ended the chat",
                            title: "liveroom chat ended",
                            type: "live_end",
                            user_type: user.user_type, //vip/normal/vvip/
                            click_action: "",
                            image_url: "",
                            notification_type: "",
                        }
                    )
                })
            }

            return res.status(200).json({ status: true, message: "video chat started", data: videoChat });

        } else if (type === 'host_end' || type === 'user_end') {
            if (videoChat.status === 'ended') throw new ApiError('videochat has ended', 400);

            let user = await User.findById(videoChat.user_id._id);
            if (user.is_deleted === true) throw new ApiError("user does not exist", 404);
            let host = await User.findById(videoChat.host_id._id);
            if (host.is_deleted === true) throw new ApiError("user does not exist", 404);

            let differenceMin = ((new Date().getTime() - Number(videoChat.start_time)) / 1000) / 60;
            differenceMin = Math.abs(Math.round(differenceMin)) + 1;

            let amount = differenceMin * videoChat.host_id.price_per_min;

            // create user txn
            let userTransaction = await Transaction.create({
                user_id: user._id,
                to_user_id: host._id,
                transaction_type: 'debit',
                transaction_by: 'user',
                item_type: 'coin',
                amount
            });
            user.balance = user.balance - amount;
            user.save();
            getUserBadge(user._id);

            // create host txn
            let hostTransaction = await Transaction.create({
                user_id: host._id,
                to_user_id: user._id,
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
            videoChat.chat_status = type;
            videoChat.total_time_in_minutes = differenceMin;
            videoChat.user_transaction_id = userTransaction._id;
            videoChat.host_transaction_id = hostTransaction._id;
            videoChat.save();

            await sendNotification(host.device_token,
                {
                    body: "Videochat has ended",
                    title: "Videochat has ended",
                    type: "ended_video_call",
                },
                {
                    body: "Videochat has ended",
                    title: "Videochat has ended",
                    type: "ended_video_call",
                    click_action: '',
                    notification_type: "",
                    user_type: host.user_type,
                    image_url: "",
                    // necessory details
                },
            )

            await sendNotification(videoChat.user_id.device_token,
                {
                    body: "Videochat has ended",
                    title: "Videochat has ended",
                    type: "ended_video_call",
                },
                {
                    body: "Videochat has ended",
                    title: "Videochat has ended",
                    type: "ended_video_call",
                    click_action: '',
                    notification_type: "",
                    user_type: videoChat.user_id.user_type,
                    image_url: "",
                    // necessory details
                },
            )

            return res.status(200).json({ status: true, message: "video chat ended", data: videoChat });
        }
        throw new ApiError('invalid type', 404)
    } catch (error) {
        next(error);
    }
}

module.exports = updateVideoChat;