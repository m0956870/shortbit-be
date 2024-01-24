const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");

const endLiveRoom = async (req, res, next) => {
    try {
        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);

        let liveRoom = await LiveRoom.findOneAndUpdate({ _id: room_id, host_id: req.user._id, status: 'ongoing' }, { end_time: Date.now(), status: 'ended', }, { new: true });
        if (!liveRoom) throw new ApiError('No live room find with this room id', 404)
        res.status(200).json({ status: true, message: "live room ended successfully", data: liveRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = endLiveRoom;