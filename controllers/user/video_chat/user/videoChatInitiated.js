const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const User = require("../../../../models/userModel");
const VideoChat = require("../../../../models/videoChat");
const sendNotification = require("../../../../utils/sendNotification");

const videoChatInitiated = async (req, res, next) => {
    console.log("videoChatInitiated -------------------------------->", req.body)
    try {
        let { host_id } = req.body;
        if (!host_id) throw new ApiError("host id is required", 400)
        if (!isValidObjectId(host_id)) throw new ApiError("Invalid host ID format", 400);

        let host = await User.findById(host_id);
        if (host.role !== 'host' || host.account_status !== 'approved') throw new ApiError("user is not a host", 403);
        if (!host) throw new ApiError('no host found', 404);
        let rootUser = req.user;

        if (host.price_per_min > rootUser.balance) throw new ApiError('user balance is low', 404);

        let existingVideoChat = await VideoChat.findOne({ user_id: rootUser._id, host_id, $or: [{ status: 'initiated' }, { status: 'ongoing' }] });
        if (existingVideoChat) throw new ApiError('chat already initiated', 400)

        let newVideoChat = await VideoChat.create({ user_id: rootUser._id, host_id });

        await sendNotification(host.device_token,
            {
                body: "A user wants to connect with you",
                title: "someone has requested for video call",
                type: "request_video_call",
            },
            {
                body: "A user wants to connect with you",
                title: "someone has requested for video call",
                type: "request_video_call",
                click_action: '',
                notification_type: "",
                user_type: "",
                image_url: "",
                // necessory details
                user_id: rootUser._id,
                room_id: newVideoChat._id,
            },
        )

        return res.status(200).json({ status: true, message: "video chat initiated", data: newVideoChat });
    } catch (error) {
        next(error);
    }
}

module.exports = videoChatInitiated;