const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VoiceRoom = require("../../../../models/voiceRoomModel");

const ongoingVoiceRoom = async (req, res, next) => {
    try {
        let host = req.user;
        if (req.user.role !== 'host' || req.user.account_status !== 'approved') throw new ApiError("not allowed", 403);

        let existingRoom = await VoiceRoom.findOne({ host_id: host._id, status: 'ongoing' });
        return res.status(200).json({ status: true, message: "voice room", data: existingRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = ongoingVoiceRoom;