const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");

const removeFromLiveRoom = async (req, res, next) => {
    try {
        let { room_id, user_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        if (!user_id) throw new ApiError("user id is required", 400)
        if (!isValidObjectId(user_id)) throw new ApiError("Invalid user ID format", 400);

        let liveRoom = await LiveRoom.findById(room_id);
        if (!liveRoom) throw new ApiError('No live room find with this id', 404)
        if (liveRoom.status === 'ended') return res.status(200).json({ status: true, message: 'this live room is ended', data: liveRoom })

        liveRoom.users = liveRoom.users.filter(ids => ids.toString() !== user_id.toString());
        liveRoom.users_token = liveRoom.users_token.filter(user => user._id.toString() !== user_id.toString());

        await liveRoom.save();
        res.status(200).json({ status: true, message: "user live room leaved", data: liveRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = removeFromLiveRoom;