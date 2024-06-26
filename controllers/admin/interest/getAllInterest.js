const Interest = require("../../../models/interestModel");

const getAllInterest = async (req, res, next) => {
    // console.log("getAllInterest -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        // const findConditions = { is_deleted: false, status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const allData = await Interest.find().lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-is_deleted -__v")

        res.status(200).json({
            status: true,
            message: "All interest fetched successfully.",
            total_data: allData.length,
            total_pages: Math.ceil(allData.length / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllInterest;