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

        await voiceRoom.save();
        res.status(200).json({ status: true, message: "user voice room joined", data: voiceRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = leaveVoiceRoom;