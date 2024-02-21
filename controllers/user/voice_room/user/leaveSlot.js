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

        // console.log("usersArr ------------------------------------", usersArr)
        usersArr.map((user, i) => {
            if(user[1]){
                console.log(user)
            }
            // if (user[i][1]?._id.toString() === rootUser._id.toString()) {
            //     // console.log("user", user)
            // }
        })

        // for (let i = 0; i < usersArr.length; i++) {
        //     const user = usersArr[i];
        //     console.log("user for", user)
        // }

        // voiceRoom.slot_users = voiceRoom.slot_users.filter(id => id?.toString() !== rootUser._id.toString())
        // console.log(voiceRoom)

        // if (!slot) throw new ApiError("slot is required", 400);
        // if (Number(slot) > 8) throw new ApiError('slot number is higher then 8', 400);
        // if (voiceRoom.slot_users[slot]) throw new ApiError('room slot is not available', 400);

        // let rootUser = req.user;
        // let hostToken = voiceRoom.users_token[0];

        // console.log(await sendNotification(hostToken,
        //     {
        //         body: "A user has requested for voice chat",
        //         title: "someone has requested for voice chat",
        //         type: "request_voice_call",
        //     },
        //     {
        //         body: "A user has requested for voice chat",
        //         title: "someone has requested for voice chat",
        //         type: "request_voice_call",
        //         click_action: '',
        //         notification_type: "",
        //         user_type: "",
        //         image_url: "",
        //         // necessory details
        //         user_id: rootUser._id,
        //         room_id,
        //         slot,
        //     },
        // ))

        res.status(201).json({ status: true, message: 'chat leaved' });

        // let roomSlot = voiceRoom.slot_users[slot] || null
        // voiceRoom.slot_users[slot] = rootUser._id
        // voiceRoom.save()

        // voiceRoom.slot_users = voiceRoom.slot_users.filter(id => id?.toString() !== rootUser._id.toString())
        // console.log(voiceRoom)

        // res.json({ voiceRoom, hostToken , roomSlot})
    } catch (error) {
        next(error);
    }
}

module.exports = leaveSlot;