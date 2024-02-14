const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VoiceRoom = require("../../../../models/voiceRoomModel");

const endVoiceRoom = async (req, res, next) => {
    try {
        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        const rootUser = req.user;

        let voiceRoom = await VoiceRoom.findOneAndUpdate({ _id: room_id, host_id: rootUser._id, status: 'ongoing' }, { end_time: Date.now(), status: 'ended', }, { new: true });
        if (!voiceRoom) throw new ApiError('No voice room find with this room id', 404)

        rootUser.voice_room_id = null;
        rootUser.is_voice_busy = false;
        rootUser.save();
        res.status(200).json({ status: true, message: "voice room ended successfully", data: voiceRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = endVoiceRoom;