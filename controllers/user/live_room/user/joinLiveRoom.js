const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");

const joinLiveRoom = async (req, res, next) => {
    try {
        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        let user = req.user;

        let liveRoom = await LiveRoom.findById(room_id);
        if (!liveRoom) throw new ApiError('No live room find with this id', 404);
        if (liveRoom.status === 'ended') return res.status(200).json({ status: false, message: 'this live room is ended', data: liveRoom });

        liveRoom.users.push(req.user._id);
        liveRoom.users = [...new Set(liveRoom.users)];
        if (liveRoom.users.length > liveRoom.peak_view_count) liveRoom.peak_view_count = liveRoom.users.length;

        await liveRoom.save();
        res.status(200).json({ status: true, message: "user live room joined", data: liveRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = joinLiveRoom;