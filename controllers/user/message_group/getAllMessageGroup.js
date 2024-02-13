const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require('../../../models/userModel');
const MessageGroup = require("../../../models/messageModel");

const getAllMessageGroup = async (req, res, next) => {
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;
        const rootUser = req.user;

        const allData = await MessageGroup.find({ from_id: rootUser._id })
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-is_deleted -__v")
            .populate('to_id', '-password -__v -location -otp -otp_expiry -interest')

        const dataCount = await MessageGroup.countDocuments({ from_id: rootUser._id })

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