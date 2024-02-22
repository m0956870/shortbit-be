const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VoiceRoom = require("../../../../models/voiceRoomModel");
const sendNotification = require("../../../../utils/sendNotification");

const requestSlot = async (req, res, next) => {
    // console.log("requestSlot")
    try {
        let { room_id, slot } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        
        const voiceRoom = await VoiceRoom.findById(room_id);
        if (!voiceRoom) throw new ApiError('no room found', 404);
        if (voiceRoom.status !== 'ongoing') throw new ApiError('room has ended', 400);
       
        if (!slot) throw new ApiError("slot is required", 400)
        if (Number(slot) > 8) throw new ApiError('slot number is higher then 8', 400)
        if (voiceRoom.slot_users[slot]) throw new ApiError('room slot is not available', 400);

        let rootUser = req.user;
        let hostToken = voiceRoom.users_token[0];

       await sendNotification(hostToken,
            {
                body: "A user has requested for voice chat",
                title: "someone has requested for voice chat",
                type: "request_voice_call",
            },
            {
                body: "A user has requested for voice chat",
                title: "someone has requested for voice chat",
                type: "request_voice_call",
                click_action: '',
                notification_type: "",
                user_type: "",
                image_url: "",
                // necessory details
                user_id: rootUser._id,
                room_id,
                slot,
            },
        )

        res.status(201).json({ status: true, message: 'request sent' });
    } catch (error) {
        next(error);
    }
}

module.exports = requestSlot;