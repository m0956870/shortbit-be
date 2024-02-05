const { isValidObjectId } = require("mongoose");
const Settlement = require("../../../models/settlementModel");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const getSettlementListing = async (req, res, next) => {
    // console.log("getSettlementListing -------------------------->")
    try {
        let { page, limit, host_id, agency_id } = req.query;
        if (host_id) if (!isValidObjectId(host_id)) throw new ApiError("Invalid host ID format", 400);
        if (agency_id) if (!isValidObjectId(agency_id)) throw new ApiError("Invalid agency ID format", 400);

        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = {};
        if (host_id) findConditions.host_id = host_id;
        if (agency_id) findConditions.agency_id = agency_id;

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