const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VoiceRoom = require("../../../../models/voiceRoomModel");
const sendNotification = require("../../../../utils/sendNotification");

const leaveSlot = async (req, res, next) => {
    // console.log("leaveSlot")
    try {
        let { room_id, slot } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400);
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);

        const voiceRoom = await VoiceRoom.findById(room_id);
        if (!voiceRoom) throw new ApiError('no room found', 404);
        if (voiceRoom.status !== 'ongoing') throw new ApiError('room has ended', 400);

        let rootUser = req.user;

        let usersArr = Object.entries(voiceRoom.slot_users)
        usersArr.map((user, i) => {
            if (user[1]) {
                if (user[1]._id.toString() == req.user._id.toString()) user[1] = null;
            }
            return user;
        })

        let obj = Object.fromEntries(usersArr)
        voiceRoom.slot_users = obj;
        voiceRoom.save()

        voiceRoom.users_token.map(async (token) => {
            if (token !== req.user.device_token) {
                await sendNotification(token,
                    {
                        body: "A user has left the chat",
                        title: "someone has left the chat",
                        type: "leave_voice_call",
                        user_type: "vip", //vip/normal/vvip/
                    },
                    {
                        body: "A user has left the chat",
                        title: "someone has left the chat",
                        type: "leave_voice_call",
                        user_type: "vip", //vip/normal/vvip/
                        click_action: "",
                        image_url: "",
                        notification_type: "",
                    })
            }
        })

        res.status(201).json({ status: true, message: 'chat leaved' });
    } catch (error) {
        next(error);
    }
}

module.exports = leaveSlot;