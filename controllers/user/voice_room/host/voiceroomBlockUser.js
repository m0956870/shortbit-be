const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");
const User = require("../../../../models/userModel");
const VoiceRoom = require("../../../../models/voiceRoomModel");

const voiceroomBlockUser = async (req, res, next) => {
    try {
        let { type, room_id, user_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        if (!user_id) throw new ApiError("user id is required", 400)
        if (!isValidObjectId(user_id)) throw new ApiError("Invalid user ID format", 400);

        let voiceRoom = await VoiceRoom.findById(room_id);
        let user = await User.findById(user_id);
        if (!voiceRoom) throw new ApiError('No live room find with this id', 404)
        if (voiceRoom.status === 'ended') return res.status(200).json({ status: true, message: 'this live room is ended', data: voiceRoom })
        if (!user) throw new ApiError('No user find with this id', 404)
        if (user.is_deleted === true) throw new ApiError("user does not exist", 404);

        if (type === "temporary") {
            if (voiceRoom.users.includes(user._id)) {
                voiceRoom.blocked_users.push(user._id);
                voiceRoom.users = voiceRoom.users.filter(ids => ids.toString() !== user_id.toString());
                voiceRoom.users_token = voiceRoom.users_token.filter(user => user._id.toString() !== user_id.toString());
              
                let usersArr = Object.entries(voiceRoom.slot_users);
                usersArr.map((slotUser, i) => {
                    if (slotUser[1]) {
                        if (slotUser[1]._id.toString() == user._id.toString()) slotUser[1] = null;
                    }
                    return slotUser;
                })

                let obj = Object.fromEntries(usersArr)
                voiceRoom.slot_users = obj;

                if (voiceRoom.users.length > voiceRoom.peak_view_count) voiceRoom.peak_view_count = voiceRoom.users.length;

                await voiceRoom.save();
                res.status(200).json({ status: true, message: "user blocked", data: voiceRoom });
            } else {
                throw new ApiError('user is not present in liveroom', 400);
            }
        } else if (type === "permanent") {
            let rootUser = req.user;

            if (voiceRoom.users.includes(user._id)) {
                rootUser.blocked_users.push(user._id);
                await rootUser.save();

                voiceRoom.users = voiceRoom.users.filter(ids => ids.toString() !== user_id.toString());
                voiceRoom.users_token = voiceRoom.users_token.filter(user => user._id.toString() !== user_id.toString());

                if (voiceRoom.users.length > voiceRoom.peak_view_count) voiceRoom.peak_view_count = voiceRoom.users.length;

                let usersArr = Object.entries(voiceRoom.slot_users);
                usersArr.map((slotUser, i) => {
                    if (slotUser[1]) {
                        if (slotUser[1]._id.toString() == user._id.toString()) slotUser[1] = null;
                    }
                    return slotUser;
                })

                let obj = Object.fromEntries(usersArr)
                voiceRoom.slot_users = obj;

                await voiceRoom.save();
                return res.status(200).json({ status: true, message: "user blocked", data: voiceRoom });
            }
            throw new ApiError('user is not present in liveroom', 400);
        }
        throw new ApiError('invalid type', 400)
    } catch (error) {
        next(error);
    }
}

module.exports = voiceroomBlockUser;