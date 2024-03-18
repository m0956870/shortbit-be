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
        if (voiceRoom.blocked_users.includes(req.user._id)) throw new ApiError('user is blocked by host', 400);
      
        let usersArr = Object.entries(voiceRoom.slot_users)
        voiceRoom.requested_slot_users.map(reqUser => {
            if(reqUser._id.toString() === req.user._id.toString()) throw new ApiError('user already requested', 400);
        })
        usersArr.map((user, i) => {
            if (user[1]) if (user[1]._id.toString() == req.user._id.toString()) throw new ApiError('user already added', 400);
        })

        if (!slot) throw new ApiError("slot is required", 400)
        let slotValidation = true
        if (slot === 'one' || slot === 'two' || slot === 'three' || slot === 'four' || slot === 'five' || slot === 'six' || slot === 'seven' || slot === 'eight') slotValidation = false;
        if (slotValidation) throw new ApiError('invalid slot type', 400);
        if (voiceRoom.slot_users[slot]) throw new ApiError('room slot is not available', 400);

        let requestedSlotUser = {
            _id: req.user._id,
            device_token: req.user.device_token,
            user_type: req.user.user_type,
        }

        voiceRoom.requested_slot_users.push(requestedSlotUser);
        voiceRoom.save();

        let rootUser = req.user;
        let hostToken = voiceRoom.users_token[0].device_token;

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
                image_url: "",
                // necessory details
                room_id,
                slot,
                user_type: rootUser.device_token,
                user_id: rootUser._id,
                user_name: rootUser.name,
                user_username: rootUser.user_name,
                user_gender: rootUser.gender,
                user_age: rootUser.age,
                user_profile_image: rootUser.profile_image,
                user_followers: rootUser.followers_count,
                user_avtar: rootUser.avtar,
            },
        )

        res.status(201).json({ status: true, message: 'request sent' });
    } catch (error) {
        next(error);
    }
}

module.exports = requestSlot;