const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");

const leaveLiveRoom = async (req, res, next) => {
    try {
        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        let user = req.user;

        let liveRoom = await LiveRoom.findById(room_id);
        if (!liveRoom) throw new ApiError('No live room find with this id', 404)
        if (liveRoom.status === 'ended') return res.status(200).json({ status: true, message: 'this live room is ended', data: liveRoom })

        liveRoom.users = liveRoom.users.filter(ids => ids !== req.user._id.toString());
        liveRoom.users_token = liveRoom.users_token.filter(token => token !== req.user.token);

        await liveRoom.save();
        res.status(200).json({ status: true, message: "user live room joined", data: liveRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = leaveLiveRoom;