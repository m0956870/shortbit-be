const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");
const endOngoingLiveRoom = require("../../../../utils/endOngoingLiveRoom");

const updateLiveRoomStatus = async (req, res, next) => {
    try {
        let host = req.user;
        if (host.role !== 'host' || host.account_status !== 'approved') throw new ApiError("not allowed", 403);

        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);

        let currentTime = Date.now();
        let liveRoom = await LiveRoom.findOneAndUpdate({ _id: room_id, host_id: host._id, status: 'ongoing' }, { last_active_time: currentTime }, { new: true });
        if (!liveRoom) throw new ApiError('No live room find with this room id', 404)

        if (liveRoom.scheduler_id) clearTimeout(liveRoom.scheduler_id)
        liveRoom.scheduler_id = setTimeout(endOngoingLiveRoom(liveRoom), currentTime + 15 * 60 * 1000);

        res.status(200).json({ status: true, message: "live room ended successfully", data: liveRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = updateLiveRoomStatus;