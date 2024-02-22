const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const LiveRoom = require("../../../../models/liveRoomModel");
const sendNotification = require("../../../../utils/sendNotification");

const endLiveRoom = async (req, res, next) => {
    try {
        let { room_id } = req.body;
        if (!room_id) throw new ApiError("room id is required", 400)
        if (!isValidObjectId(room_id)) throw new ApiError("Invalid room ID format", 400);

        // let liveRoom = await LiveRoom.findOneAndUpdate({ _id: room_id, host_id: req.user._id, status: 'ongoing' }, { end_time: Date.now(), status: 'ended', }, { new: true });
        let liveRoom = await LiveRoom.findById(room_id)
        if (!liveRoom) throw new ApiError('No live room find with this room id', 404)

        liveRoom.end_time = Date.now();
        liveRoom.status = 'ended';
        liveRoom.save()

        liveRoom.users_token.map(async (token) => {
            // console.log(token)
            if (token !== req.user.device_token) {
                await sendNotification(token,
                    {
                        body: "Host has ended the chat",
                        title: "liveroom chat ended",
                        type: "live_end",
                    },
                    {
                        body: "Host has ended the chat",
                        title: "liveroom chat ended",
                        type: "live_end",
                        user_type: "", //vip/normal/vvip/
                        click_action: "",
                        image_url: "",
                        notification_type: "",
                    }
                )
            }
        })

        req.user.live_room_id = null;
        req.user.is_live_busy = false;
        req.user.save();

        res.status(200).json({ status: true, message: "live room ended successfully", data: liveRoom });
    } catch (error) {
        next(error);
    }
}

module.exports = endLiveRoom;