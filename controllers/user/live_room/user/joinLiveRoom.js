const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");
const Follow = require("../../../../models/followModel");

const joinLiveRoom = async (req, res, next) => {
    try {
        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        let user = req.user;

        let liveRoom = await LiveRoom.findById(room_id)
            .populate('host_id', 'name profile_image followers_count')

        if (!liveRoom) throw new ApiError('No live room find with this id', 404);
        if (liveRoom.status === 'ended') return res.status(200).json({ status: false, message: 'this live room is ended', data: liveRoom });

        let is_followed = await Follow.findOne({ follower_id: req.user._id, following_id: liveRoom.host_id._id }).lean()

        liveRoom.users.push(req.user._id);
        liveRoom.users = [...new Set(liveRoom.users)];
        if (liveRoom.users.length > liveRoom.peak_view_count) liveRoom.peak_view_count = liveRoom.users.length;
        await liveRoom.save();

        let roomData = liveRoom.toJSON();
        roomData.is_followed = is_followed ? true : false,

        res.status(200).json({ status: true, message: "user live room joined", data: roomData });
    } catch (error) {
        next(error);
    }
}

module.exports = joinLiveRoom;