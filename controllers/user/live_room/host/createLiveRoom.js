const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");

const createLiveRoom = async (req, res, next) => {
    try {
        let host = req.user;
        if (req.user.role !== 'host' || req.user.account_status !== 'approved') throw new ApiError("not allowed to create live room", 403);

        let existingLiveRoom = await LiveRoom.findOne({ host_id: host._id, status: 'ongoing' });
        if (existingLiveRoom) throw new ApiError("live room already created", 400);

        let tokenUser = {
            _id: host._id,
            device_token: host.device_token,
            user_type: host.user_type,
            name: host.name,
            profile_image: host.profile_image,
        }

        let liveRoom = await LiveRoom.create({ host_id: host._id, users_token: [tokenUser], status: 'ongoing', });
        req.user.live_room_id = liveRoom._id;
        req.user.is_live_busy = true;
        req.user.save();

        return res.status(200).json({ status: true, message: "live room created successfully", data: liveRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = createLiveRoom;