const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");
const Follow = require("../../../../models/followModel");
const sendNotification = require("../../../../utils/sendNotification");

const joinLiveRoom = async (req, res, next) => {
    try {
        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);
        let user = req.user;

        let liveRoom = await LiveRoom.findById(room_id)
            .populate('host_id', 'name profile_image followers_count blocked_users')

        if (!liveRoom) throw new ApiError('No live room find with this id', 404);
        if (liveRoom.status === 'ended') return res.status(200).json({ status: false, message: 'this live room is ended', data: liveRoom });
        if (liveRoom.blocked_users.includes(user._id)) throw new ApiError('user is blocked by host', 400);
        if (liveRoom.host_id.blocked_users.includes(req.user._id)) throw new ApiError('user is blocked by host', 400);

        if (!liveRoom.users.includes(user._id)) {
            let tokenUser = {
                _id: user._id,
                device_token: user.device_token,
                user_type: user.user_type,
                name: user.name,
                profile_image: user.profile_image,
            }

            liveRoom.users.push(user._id);
            liveRoom.users_token.push(tokenUser);
            if (liveRoom.users.length > liveRoom.peak_view_count) liveRoom.peak_view_count = liveRoom.users.length;
        }
        await liveRoom.save();

        let is_followed = await Follow.findOne({ follower_id: req.user._id, following_id: liveRoom.host_id._id }).lean()
        let roomData = liveRoom.toJSON();
        roomData.is_followed = is_followed ? true : false;

        liveRoom.users_token.map(async (user) => {
            await sendNotification(user.device_token,
                {
                    body: "New user has joined the chat",
                    title: "someone has joined the chat",
                    type: "add_new_user_live",
                    user_type: user.user_type, //vip/normal/vvip/
                },
                {
                    body: "New user has joined the chat",
                    title: "someone has joined the chat",
                    type: "add_new_user_live",
                    user_type: user.user_type, //vip/normal/vvip/
                    click_action: "",
                    image_url: "",
                    notification_type: "",
                    user_image: user.profile_image,
                    user_name: user.name,
                })
        })

        res.status(200).json({ status: true, message: "user live room joined", data: roomData });
    } catch (error) {
        next(error);
    }
}

module.exports = joinLiveRoom;