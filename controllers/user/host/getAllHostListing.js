const User = require("../../../models/userModel");

const getAllHostListing = async (req, res, next) => {
    // console.log("getAllHostListing -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { _id: { $nin: req.user._id }, role: 'host', account_status: 'approved', is_deleted: false };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        let dataCount = await User.countDocuments(findConditions);
        const allData = await User.find(findConditions)
            .lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-password -is_deleted -updatedAt -otp -otp_expiry -__v")

        res.status(200).json({
            status: true,
            message: "host listing",
            total_data: dataCount,
            total_pages: Math.ceil(dataCount / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllHostListing;