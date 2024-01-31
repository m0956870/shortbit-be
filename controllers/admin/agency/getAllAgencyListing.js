const Agency = require("../../../models/agencyModel");

const getAllAgencyListing = async (req, res, next) => {
    // console.log("getAllAgencyListing -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { is_deleted: false, status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const allData = await Agency.find(findConditions)
            .lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-password -is_deleted -updatedAt -otp -otp_expiry -__v")

        res.status(200).json({
            status: true,
            message: "all listing",
            total_data: allData.length,
            total_pages: Math.ceil(allData.length / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllAgencyListing;