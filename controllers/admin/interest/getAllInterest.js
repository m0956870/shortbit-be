const Interest = require("../../../models/interestModel");

const getAllInterest = async (req, res, next) => {
    // console.log("getAllInterest -------------------------->")
    try {
        // let { page, limit, type } = req.query;
        // page = page && page;
        // limit = limit && limit;

        // const findConditions = { is_deleted: false, status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const allRecordsCount = await Interest.countDocuments();
        if (allRecordsCount === 0) return res.status(200).json({ status: true, message: "No allData found!", data: [] });

        const allData = await Interest.find().lean()
            // .skip((page * limit) - limit)
            // .limit(limit)
            .sort({ name: 1 })
            .select("-is_deleted -__v")

        res.status(200).json({
            status: true,
            message: "All interest fetched successfully.",
            total_records: allRecordsCount,
            // total_pages: Math.ceil(allRecordsCount / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllInterest;