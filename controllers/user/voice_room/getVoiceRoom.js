const VoiceRoom = require("../../../models/voiceRoomModel");

const getVoiceRoom = async (req, res, next) => {
    // console.log("getVoiceRoom -------------------------->", req.user)
    try {
        let { id } = req.query;

        const voiceRoom = await VoiceRoom.findById(id)
            .select(" -__v")
            .populate('host_id slot_users', 'name profile_image level language followers_count')
            .lean()

        res.status(200).json({
            status: true,
            message: "voice rooms listing",
            data: voiceRoom,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getVoiceRoom;