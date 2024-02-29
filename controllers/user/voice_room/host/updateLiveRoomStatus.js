const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");
// const endOngoingLiveRoom = require("../../../../utils/endOngoingLiveRoom");

const updateLiveRoomStatus = async (req, res, next) => {
    try {
        let host = req.user;

        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);

        let currentTime = new Date();

        let voiceRoom = await LiveRoom.findOne({ _id: room_id, host_id: host._id, status: 'ongoing' });
        if (!voiceRoom) throw new ApiError('No live room find with this room id', 404)

        if (voiceRoom.scheduler_id) clearTimeout(voiceRoom.scheduler_id)
        let scheduler_id = setTimeout(async () => {
            await LiveRoom.findOneAndUpdate(voiceRoom._id, { end_time: new Date(), status: 'ended' }, { new: true });
            host.is_live_busy = false;
            host.save();
        }, 15 * 60 * 1000);

        voiceRoom.last_active_time = currentTime;
        voiceRoom.scheduler_id = scheduler_id;
        voiceRoom.save();

        res.status(200).json({ status: true, message: "time updated", data: voiceRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = updateLiveRoomStatus;