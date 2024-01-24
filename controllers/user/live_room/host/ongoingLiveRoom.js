const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");

const ongoingLiveRoom = async (req, res, next) => {
    try {
        let host = req.user;
        if (req.user.role !== 'host' || req.user.account_status !== 'approved') throw new ApiError("not allowed", 403);

        let existingLiveRoom = await LiveRoom.findOne({ host_id: host._id, status: 'ongoing' });
        return res.status(200).json({ status: true, message: "live room", data: existingLiveRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = ongoingLiveRoom;