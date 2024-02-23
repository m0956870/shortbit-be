const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const VideoChat = require("../../../models/videoChat");

const videoChatScheduler = async (req, res, next) => {
    console.log("videoChatScheduler ---------------------------->", req.body)
    try {
        let { chat_id } = req.body;
        if (!chat_id) throw new ApiError("chat id is required", 400)
        if (!isValidObjectId(chat_id)) throw new ApiError("Invalid chat ID format", 400);
        let videoChat = await VideoChat.findById(chat_id).populate('user_id host_id', 'name profile_image followers_count')
        if (!videoChat) throw new ApiError('No video chat find with this id', 404);
        if (videoChat.status === 'ended') throw new ApiError('video chat has ended', 400);

        let rootUser = req.user;
        if (rootUser._id.toString() !== videoChat.user_id._id.toString()) throw new ApiError('video chat not initiated by this user', 400);
        
        let differenceMin = ((new Date().getTime() - Number(videoChat.last_captured_time)) / 1000) / 60;
        differenceMin = Math.abs(Math.round(differenceMin))
        console.log(differenceMin)
        
        // videoChat.last_captured_time = Date.now();
        // videoChat.save();

        res.json({ videoChat, rootUser })
    } catch (error) {
        next(error);
    }
}

module.exports = videoChatScheduler;