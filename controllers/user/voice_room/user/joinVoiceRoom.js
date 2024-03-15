const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const VoiceRoom = require("../../../../models/voiceRoomModel");
const Follow = require("../../../../models/followModel");
const sendNotification = require("../../../../utils/sendNotification");

const joinVoiceRoom = async (req, res, next) => {
    try {
        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        let user = req.user;

        let voiceRoom = await VoiceRoom.findById(room_id)
            .populate('host_id', 'name profile_image followers_count blocked_users')

        if (!voiceRoom) throw new ApiError('No voice room find with this id', 404);
        if (voiceRoom.status === 'ended') return res.status(200).json({ status: false, message: 'this voice room is ended', data: voiceRoom });
        if (voiceRoom.host_id.blocked_users.includes(req.user._id)) throw new ApiError('user is blocked by host', 400);

        let is_followed = await Follow.findOne({ follower_id: user._id, following_id: voiceRoom.host_id._id }).lean()

        if (!voiceRoom.users.includes(user._id)) {
            let tokenUser = {
                _id: user._id,
                device_token: user.device_token,
                user_type: user.user_type,
            }

            voiceRoom.users.push(user._id);
            voiceRoom.users_token.push(tokenUser);
            if (voiceRoom.users.length > voiceRoom.peak_view_count) voiceRoom.peak_view_count = voiceRoom.users.length;
        }
        await voiceRoom.save();

        let roomData = voiceRoom.toJSON();
        roomData.is_followed = is_followed ? true : false,

            voiceRoom.users_token.map(async (user) => {
                await sendNotification(user.device_token,
                    {
                        body: "New user has joined the chat",
                        title: "someone has joined the chat",
                        type: "add_new_user_voice",
                        user_type: user.user_type, //vip/normal/vvip/
                    },
                    {
                        body: "New user has joined the chat",
                        title: "someone has joined the chat",
                        type: "add_new_user_voice",
                        user_type: user.user_type, //vip/normal/vvip/
                        click_action: "",
                        image_url: "",
                        notification_type: "",
                    })
            })

        res.status(200).json({ status: true, message: "user voice room joined", data: roomData });
    } catch (error) {
        next(error);
    }
}

module.exports = joinVoiceRoom;