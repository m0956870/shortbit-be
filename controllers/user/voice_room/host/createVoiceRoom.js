const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VoiceRoom = require("../../../../models/voiceRoomModel");

const createVoiceRoom = async (req, res, next) => {
    try {
        let host = req.user;
        if (host.role !== 'host' || host.account_status !== 'approved') throw new ApiError("not allowed to create voice room", 403);

        let existingRoom = await VoiceRoom.findOne({ host_id: host._id, status: 'ongoing' });
        if (existingRoom) throw new ApiError("voice room already exist", 400);

        let tokenUser = {
            _id: host._id,
            device_token: host.device_token,
            user_type: host.user_type,
        }

        let voiceRoom = await VoiceRoom.create({ host_id: host._id, users_token: [tokenUser], status: 'ongoing', });
        req.user.voice_room_id = voiceRoom._id;
        req.user.is_voice_busy = true;
        req.user.save();

        return res.status(200).json({ status: true, message: "voice room created successfully", data: voiceRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = createVoiceRoom;