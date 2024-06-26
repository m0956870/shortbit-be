const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require('../../../models/userModel');
const MessageGroup = require("../../../models/messageModel");

const createMessageGroup = async (req, res, next) => {
    try {
        let { to_id } = req.body;
        if (!to_id) throw new ApiError("to id is required", 400)
        if (!isValidObjectId(to_id)) throw new ApiError("Invalid to ID format", 400);
        const toUser = await User.findById(to_id);
        if (!toUser) throw new ApiError("no to user found", 404);
        if (toUser.is_deleted === true) throw new ApiError("user does not exist", 404);
        const rootUser = req.user;

        const existingMessageGroup = await MessageGroup.findOne({ from_id: rootUser._id, to_id }).populate('from_id to_id', '-password -__v -location -otp -otp_expiry -interest')
        if (existingMessageGroup) return res.status(200).json({ status: true, message: "message group", data: existingMessageGroup })

        const group_id = rootUser._id + '_' + to_id
        const messageGroup = await MessageGroup.create({ from_id: rootUser._id, to_id, group_id });
        await messageGroup.populate('from_id to_id', '-password -__v -location -otp -otp_expiry -interest')
        res.status(200).json({ status: true, message: "message group created", data: messageGroup })
    } catch (error) {
        next(error);
    }
}

module.exports = createMessageGroup;