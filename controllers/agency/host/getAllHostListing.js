const User = require("../../../models/userModel");

const getAllHostListing = async (req, res, next) => {
    // console.log("getAllHostListing -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        let { agency_code } = req.user;

        const findConditions = { agency_code, role: 'host', is_deleted: false };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const allData = await User.find(findConditions)
            .lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-password -is_deleted -updatedAt -otp -otp_expiry -__v")

        let dataCount = await User.countDocuments(findConditions);
        res.status(200).json({
            status: true,
            message: "all listing",
            total_data: dataCount,
            total_pages: Math.ceil(dataCount / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllHostListing;