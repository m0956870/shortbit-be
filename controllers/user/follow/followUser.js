const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Follow = require("../../../models/followModel");
const User = require("../../../models/userModel");
const VoiceRoom = require("../../../models/voiceRoomModel");
const sendNotification = require("../../../utils/sendNotification");

const followUser = async (req, res, next) => {
    try {
        let { following_id, voiceroom_id } = req.body;
        if (!following_id) throw new ApiError("following user id is required", 400)
        if (!isValidObjectId(following_id)) throw new ApiError("Invalid ID format", 400);
        let rootUser = req.user;

        let oldRecord = await Follow.findOne({ follower_id: rootUser._id, following_id, })
        if (!oldRecord) {
            let userFollowing = await User.findByIdAndUpdate(following_id, { $inc: { followers_count: 1 } }, { new: true })
            if (!userFollowing) throw new ApiError("no user found with this ID, 404");
            await Follow.create({ follower_id: rootUser._id, following_id, });

            rootUser.following_count = rootUser.following_count + 1
            rootUser.save();

            if (voiceroom_id) {
                const voiceRoom = await VoiceRoom.findById(voiceroom_id);
                if (!voiceRoom) throw new ApiError('no room found', 404);
                if (voiceRoom.status !== 'ongoing') throw new ApiError('room has ended', 400);

                voiceRoom.users_token.map(async (token) => {
                    // if (token !== req.user.device_token) {
                    await sendNotification(token,
                        {
                            body: "New user has joined the chat",
                            title: "someone has joined the chat",
                            type: "follow_voice_call",
                            user_type: "vip", //vip/normal/vvip/
                        },
                        {
                            body: "New user has joined the chat",
                            title: "someone has joined the chat",
                            type: "follow_voice_call",
                            user_type: "vip", //vip/normal/vvip/
                            click_action: "",
                            image_url: "",
                            notification_type: "",
                        })
                    // }
                })
            }

            res.status(201).json({ status: true, message: "User followed successfully" })
        } else {
            let userFollowing = await User.findByIdAndUpdate(following_id, { $inc: { followers_count: -1 } }, { new: true })
            if (!userFollowing) throw new ApiError("no user found with this ID, 404");
            await Follow.deleteOne({ follower_id: rootUser._id, following_id, });
            rootUser.following_count = rootUser.following_count - 1
            rootUser.save();

            if (voiceroom_id) {
                const voiceRoom = await VoiceRoom.findById(voiceroom_id);
                if (!voiceRoom) throw new ApiError('no room found', 404);
                if (voiceRoom.status !== 'ongoing') throw new ApiError('room has ended', 400);

                voiceRoom.users_token.map(async (token) => {
                    // if (token !== req.user.device_token) {
                    await sendNotification(token,
                        {
                            body: "New user has joined the chat",
                            title: "someone has joined the chat",
                            type: "follow_voice_call",
                            user_type: "vip", //vip/normal/vvip/
                        },
                        {
                            body: "New user has joined the chat",
                            title: "someone has joined the chat",
                            type: "follow_voice_call",
                            user_type: "vip", //vip/normal/vvip/
                            click_action: "",
                            image_url: "",
                            notification_type: "",
                        })
                    // }
                })
            }

            res.status(201).json({ status: true, message: "User unfollowed successfully" })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = followUser;