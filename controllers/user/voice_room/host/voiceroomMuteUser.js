const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const sendNotification = require("../../../../utils/sendNotification");
const User = require("../../../../models/userModel");

const voiceroomMuteUser = async (req, res, next) => {
    // console.log("voiceroomMuteUser")
    try {
        let { user_id, type } = req.body;

        if (!type) throw new ApiError("type is required", 400);
        if (!user_id) throw new ApiError("user id is required", 400);
        if (!isValidObjectId(user_id)) throw new ApiError("Invalid user ID format", 400);
        const user = await User.findById(user_id);
        if (!user) throw new ApiError('no user found', 404);
        if (user.is_deleted === true) throw new ApiError("user does not exist", 404);

        if (type === 'mute') {
            await sendNotification(user.device_token,
                {
                    body: "user mute",
                    title: "user mute",
                    type: "voiceroom_user_mute",
                    user_type: user.user_type, // vip/normal/vvip/
                },
                {
                    body: "user mute",
                    title: "user mute",
                    type: "voiceroom_user_mute",
                    user_type: user.user_type, // vip/normal/vvip/
                    click_action: "",
                    image_url: "",
                    notification_type: "",
                })

            res.status(200).json({ status: true, message: "user mute", });
        }
        else if (type === 'unmute') {
            await sendNotification(user.device_token,
                {
                    body: "user unmute",
                    title: "user unmute",
                    type: "voiceroom_user_unmute",
                    user_type: user.user_type, // vip/normal/vvip/
                },
                {
                    body: "user unmute",
                    title: "user unmute",
                    type: "voiceroom_user_unmute",
                    user_type: user.user_type, // vip/normal/vvip/
                    image_url: "",
                    notification_type: "",
                })

            res.status(200).json({ status: true, message: "user unmute", });
        } else {
            throw new ApiError("invalid type", 400);
        }

    } catch (error) {
        next(error);
    }
}

module.exports = voiceroomMuteUser;