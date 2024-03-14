const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");
const User = require("../../../../models/userModel");

const blockUser = async (req, res, next) => {
    try {
        let { type, room_id, user_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        if (!user_id) throw new ApiError("user id is required", 400)
        if (!isValidObjectId(user_id)) throw new ApiError("Invalid user ID format", 400);

        let liveRoom = await LiveRoom.findById(room_id);
        let user = await User.findById(user_id);
        if (!liveRoom) throw new ApiError('No live room find with this id', 404)
        if (liveRoom.status === 'ended') return res.status(200).json({ status: true, message: 'this live room is ended', data: liveRoom })
        if (!user) throw new ApiError('No user find with this id', 404)
        if (user.is_deleted === true) throw new ApiError("user does not exist", 404);

        if (type === "temporary") {
            if (liveRoom.users.includes(user._id)) {
                liveRoom.blocked_users.push(user._id);
                liveRoom.users = liveRoom.users.filter(ids => ids.toString() !== user_id.toString());
                liveRoom.users_token = liveRoom.users_token.filter(user => user._id.toString() !== user_id.toString());

                if (liveRoom.users.length > liveRoom.peak_view_count) liveRoom.peak_view_count = liveRoom.users.length;

                await liveRoom.save();
                res.status(200).json({ status: true, message: "user blocked", data: liveRoom });
            } else {
                throw new ApiError('user is not present in liveroom', 400);
            }
        } else if (type === "permanent") {
            return res.send('working on it...')
            // let rootUser = req.user;

            // if (liveRoom.users.includes(user._id)) {
            //     rootUser.blocked_users.push(user._id);
            //     await rootUser.save();

            //     liveRoom.users = liveRoom.users.filter(ids => ids.toString() !== user_id.toString());
            //     liveRoom.users_token = liveRoom.users_token.filter(user => user._id.toString() !== user_id.toString());

            //     if (liveRoom.users.length > liveRoom.peak_view_count) liveRoom.peak_view_count = liveRoom.users.length;

            //     await liveRoom.save();
            //     return res.status(200).json({ status: true, message: "user blocked", data: liveRoom });
            // }
            // throw new ApiError('user is not present in liveroom', 400);
        }
        throw new ApiError('invalid type', 400)
    } catch (error) {
        next(error);
    }
}

module.exports = blockUser;