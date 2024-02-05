const { isValidObjectId } = require("mongoose");
const Settlement = require("../../../models/settlementModel");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const getSettlementListing = async (req, res, next) => {
    // console.log("getSettlementListing -------------------------->")
    try {
        let { page, limit, host_id } = req.query;
        if (host_id) if (!isValidObjectId(host_id)) throw new ApiError("Invalid room ID format", 400);

        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { agency_id: req.user._id };
        if (host_id) findConditions.host_id = host_id;

        let settlements = await Settlement.find(findConditions)
            .lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('host_id', 'name email profile_image phone_number balance')
            .select('-__v')

        let dataCount = await Settlement.countDocuments(findConditions)

        res.status(200).json({
            status: true,
            message: "settlement listing",
            total_data: dataCount,
            total_pages: Math.ceil(dataCount / limit),
            data: settlements,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getSettlementListing;