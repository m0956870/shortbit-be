const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Follow = require("../../../models/followModel");
const VoiceRoom = require("../../../models/voiceRoomModel");

const getVoiceRoom = async (req, res, next) => {
    // console.log("getVoiceRoom -------------------------->", req.user)
    try {
        let { id } = req.query;
        if (!id) throw new ApiError("id is required", 400)
        if (!isValidObjectId(id)) throw new ApiError("Invalid ID format", 400);
        let rootUser = req.user;

        const voiceRoom = await VoiceRoom.findById(id)
            .select("-__v")
            .populate('host_id slot_users users', 'name profile_image level language followers_count')
            .lean()

        if (voiceRoom) {
            let is_followed = await Follow.findOne({ follower_id: rootUser._id, following_id: voiceRoom.host_id._id }).lean();
            voiceRoom.is_followed = is_followed ? true : false;
        }

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