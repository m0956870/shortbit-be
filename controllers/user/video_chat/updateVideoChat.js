const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VideoChat = require("../../../../models/videoChat");

const updateVideoChat = async (req, res, next) => {
    // console.log("updateVideoChat -------------------------------->", req.body)
    try {
        let { type, room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        let videoChat = await VideoChat.findById(room_id)
            .populate('user_id host_id', 'name profile_image followers_count')
        if (!videoChat) throw new ApiError('No video chat find with this id', 404);
        let rootUser = req.user;

        if (type === 'host_cancel') {
        } else if (type === 'host_accepted') {
        } else if (type === 'user_end') {
        } else if (type === 'host_end') {
        }

        // return res.status(200).json({ status: true, message: "video chat initiated", data: newVideoChat });
    } catch (error) {
        next(error);
    }
}

module.exports = updateVideoChat;