const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require('../../../models/userModel');
const MessageGroup = require("../../../models/messageModel");

const getAllMessageGroup = async (req, res, next) => {
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;
        const rootUser = req.user;
        // let role = rootUser.role;

        let allData = await MessageGroup.find({ $or: [{ from_id: rootUser._id }, { to_id: rootUser._id }] })
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-is_deleted -__v")
            .populate('from_id to_id', '-password -__v -location -otp -otp_expiry -interest')
            .lean()

        const dataCount = await MessageGroup.countDocuments({ $or: [{ from_id: rootUser._id }, { to_id: rootUser._id }] })

        allData.map(obj => {
            let otherUser = {};
            if (obj.from_id._id.toString() === rootUser._id.toString()) otherUser = obj.to_id;
            else otherUser = obj.from_id;
            obj.otherUser = otherUser;
        })
        allData = allData;

        res.status(200).json({
            status: true,
            message: "message group listing",
            total_records: dataCount,
            total_pages: Math.ceil(dataCount / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllMessageGroup;