const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VideoChat = require("../../../../models/videoChat");

const videoChatInitiated = async (req, res, next) => {
    console.log("videoChatInitiated -------------------------------->", req.body)
    try {
        console.log("req.user", req.user)

        let { host_id } = req.body;

        let existingVideoChat = await VideoChat.findOne({ user_id: req.user._id, host_id });
        if (existingVideoChat) return res.status(204).json({ status: false, message: 'chat already initiated.' });

        let newVideoChat = await VideoChat.create({ user_id: req.user._id, host_id });

        // let existingLiveRoom = await LiveRoom.findOne({ host_id: user._id, status: 'ongoing' });
        // if(existingLiveRoom) throw new ApiError("live room already created", 400);

        // let liveRoom = await LiveRoom.create({ host_id: user._id, status: 'ongoing', });
        // return res.status(200).json({ status: true, message: "live room created successfully", data: liveRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = videoChatInitiated;