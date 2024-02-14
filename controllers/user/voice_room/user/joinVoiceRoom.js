const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VoiceRoom = require("../../../../models/voiceRoomModel");
const Follow = require("../../../../models/followModel");

const joinVoiceRoom = async (req, res, next) => {
    try {
        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        let user = req.user;

        let voiceRoom = await VoiceRoom.findById(room_id)
            .populate('host_id', 'name profile_image followers_count')

        if (!voiceRoom) throw new ApiError('No voice room find with this id', 404);
        if (voiceRoom.status === 'ended') return res.status(200).json({ status: false, message: 'this voice room is ended', data: voiceRoom });

        let is_followed = await Follow.findOne({ follower_id: user._id, following_id: voiceRoom.host_id._id }).lean()

        voiceRoom.users.push(user._id);
        voiceRoom.users = [...new Set(voiceRoom.users)];
        console.log("fcgvhb", voiceRoom.users)
        if (voiceRoom.users.length > voiceRoom.peak_view_count) voiceRoom.peak_view_count = voiceRoom.users.length;
        await voiceRoom.save();

        let roomData = voiceRoom.toJSON();
        roomData.is_followed = is_followed ? true : false,

        res.status(200).json({ status: true, message: "user voice room joined", data: roomData });
    } catch (error) {
        next(error);
    }
}

module.exports = joinVoiceRoom;