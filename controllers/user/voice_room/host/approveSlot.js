const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VoiceRoom = require("../../../../models/voiceRoomModel");
const sendNotification = require("../../../../utils/sendNotification");
const User = require("../../../../models/userModel");

const approveSlot = async (req, res, next) => {
    // console.log("approveSlot")
    try {
        let rootUser = req.user;
        if (rootUser.role !== 'host' || rootUser.account_status !== 'approved') throw new ApiError("not allowed to approve voice room", 403);

        let { user_id, room_id, slot } = req.body;

        if (!room_id) throw new ApiError("room id is required", 400);
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        const voiceRoom = await VoiceRoom.findById(room_id);
        if (!voiceRoom) throw new ApiError('no room found', 404);
        if (voiceRoom.status !== 'ongoing') throw new ApiError('room has ended', 400);

        if (!slot) throw new ApiError("slot is required", 400);
        let slotValidation = true
        if (slot === 'one' || slot === 'two' || slot === 'three' || slot === 'four' || slot === 'five' || slot === 'six' || slot === 'seven' || slot === 'eight') slotValidation = false;
        if (slotValidation) throw new ApiError('invalid slot type', 400);
        // if (Number(slot) > 8) throw new ApiError('slot number is higher then 8', 400);
        if (voiceRoom.slot_users[slot]) throw new ApiError('room slot is not available', 400);

        if (!user_id) throw new ApiError("user id is required", 400);
        if (!isValidObjectId(user_id)) throw new ApiError("Invalid user ID format", 400);
        const user = await User.findById(user_id);
        if (!user) throw new ApiError('no user found', 404);
        let usersArr = Object.entries(voiceRoom.slot_users)
        usersArr.map((user, i) => {
            if (user[1]) if (user[1]._id.toString() == user_id.toString()) throw new ApiError('user already added', 400);
        })

        voiceRoom.slot_users[slot] = user
        voiceRoom.save();

        voiceRoom.users_token.map(async (token) => {
            // if (token !== req.user.device_token) {
            await sendNotification(token,
                {
                    body: "New user has joined the chat",
                    title: "someone has joined the chat",
                    type: "approve_voice_call",
                    user_type: "vip", //vip/normal/vvip/
                },
                {
                    body: "New user has joined the chat",
                    title: "someone has joined the chat",
                    type: "approve_voice_call",
                    user_type: "vip", //vip/normal/vvip/
                    click_action: "",
                    image_url: "",
                    notification_type: "",
                })
            // }
        })

        res.status(200).json({ status: true, message: "user request accepted", data: voiceRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = approveSlot;