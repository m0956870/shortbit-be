const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VoiceRoom = require("../../../../models/voiceRoomModel");

const leaveVoiceRoom = async (req, res, next) => {
    try {
        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        let user = req.user;

        let voiceRoom = await VoiceRoom.findById(room_id);
        if (!voiceRoom) throw new ApiError('No voice room find with this id', 404)
        if (voiceRoom.status === 'ended') return res.status(200).json({ status: true, message: 'this voice room is ended', data: voiceRoom })

        voiceRoom.users = voiceRoom.users.filter(ids => ids !== user._id.toString());
        voiceRoom.users_token = voiceRoom.users_token.filter(token => token !== req.user.device_token);
        let usersArr = Object.entries(voiceRoom.slot_users)
        usersArr.map((user, i) => {
            if (user[1]) {
                if (user[1]._id.toString() == req.user._id.toString()) user[1] = null;
            }
            return user;
        })
        let obj = Object.fromEntries(usersArr)
        voiceRoom.slot_users = obj;

        await voiceRoom.save();
        res.status(200).json({ status: true, message: "user voice room leaved", data: voiceRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = leaveVoiceRoom;