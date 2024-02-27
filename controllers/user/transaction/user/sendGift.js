const { isValidObjectId } = require("mongoose");
const Transaction = require("../../../../models/transactionModel");
const Gift = require("../../../../models/giftModel");
const User = require("../../../../models/userModel");
const LiveRoom = require("../../../../models/liveRoomModel");
const VoiceRoom = require("../../../../models/voiceRoomModel");
const { ApiError } = require("../../../../errorHandler/apiErrorHandler");
const sendNotification = require("../../../../utils/sendNotification");
const Admin = require("../../../../models/adminModel");
const getUserBadge = require("../../../../utils/getUserBadge");

const sendGift = async (req, res, next) => {
    // console.log("sendGift -----------------------", req.body)
    try {
        let { room_id, to_user_id, gift_id } = req.body
        if (!to_user_id) throw new ApiError("to user id is required", 400)
        if (!isValidObjectId(to_user_id)) throw new ApiError("Invalid host ID format", 400);
        if (!gift_id) throw new ApiError("gift id is required", 400)
        if (!isValidObjectId(gift_id)) throw new ApiError("Invalid gift ID format", 400);
        let host = await User.findById(to_user_id);
        if (!host) throw new ApiError("no user found with to_user_id", 400)
        let user = req.user;

        let gift = await Gift.findById(gift_id);
        if (!gift) throw new ApiError("no gift found with this id", 400)
        if (user.balance < gift.coins) throw new ApiError('Insufficient balance', 400);

        if (user.role === 'host' && host.role === 'user') {
            let admin = await Admin.findById("65b9d6f228e159d6ef276f9b");

            let adminTransaction = await Transaction.create({
                user_id: admin._id,
                to_user_id: user._id,
                transaction_type: 'credit',
                transaction_by: 'user',
                item_type: 'gift',
                item: gift,
                amount: gift.coins
            });
            admin.balance = admin.balance + gift.coins;
            admin.save();

            let userTransaction = await Transaction.create({
                user_id: user._id,
                to_user_id: admin._id,
                transaction_type: 'debit',
                transaction_by: 'user',
                item_type: 'gift',
                item: gift,
                amount: gift.coins
            });
            user.balance = user.balance - gift.coins;
            user.save();

            return res.status(201).json({ status: true, message: 'gift sent' });
        }

        // USER - desc balance in user account
        let userTransaction = await Transaction.create({
            user_id: user._id,
            to_user_id,
            transaction_type: 'debit',
            transaction_by: 'user',
            item_type: 'gift',
            item: gift,
            amount: gift.coins
        });
        user.balance = user.balance - gift.coins;
        user.save();

        // HOST - inc balance in host account
        let hostTransaction = await Transaction.create({
            user_id: to_user_id,
            to_user_id: user._id,
            transaction_type: 'credit',
            transaction_by: 'user',
            item_type: 'gift',
            item: gift,
            amount: gift.coins
        });
        host.balance = host.balance + gift.coins;
        host.save();
        await sendNotification(host.device_token,
            {
                body: "A user has sent the gift",
                title: "someone has sent the gift",
                type: "recived_gift",
            },
            {
                body: "A user has sent the gift",
                title: "someone has sent the gift",
                type: "recived_gift",
                click_action: '',
                image_url: gift.animation_image,
                notification_type: "",
                user_type: "",
            },
        )

        await getUserBadge("65c3226a3516e1663041a12e", 'user')

        // inc liveroom host earning
        if (room_id) {
            // await LiveRoom.findByIdAndUpdate(room_id, { $inc: { earned_coins: +gift.coins } }, { new: true });
            let liveRoom = await LiveRoom.findById(room_id)
            if (!liveRoom) {
                liveRoom = await VoiceRoom.findById(room_id)
            }
            if (!liveRoom) throw new ApiError("no room found with this id", 400)

            liveRoom.earned_coins = liveRoom.earned_coins + gift.coins
            liveRoom.save()
            liveRoom.users_token.map(async (token) => {
                // console.log(token)
                if (token !== req.user.device_token) {
                    await sendNotification(token,
                        {
                            body: "A user has sent the gift",
                            title: "someone has sent the gift",
                            type: "recived_gift",
                        },
                        {
                            body: "A user has sent the gift",
                            title: "someone has sent the gift",
                            type: "recived_gift",
                            click_action: '',
                            image_url: gift.animation_image,
                            notification_type: "",
                            user_type: "",
                        },
                    )
                }
            })
        }
        res.status(201).json({ status: true, message: 'gift sent' });
    } catch (error) {
        next(error);
    }
}

module.exports = sendGift;