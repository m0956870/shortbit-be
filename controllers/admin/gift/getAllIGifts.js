const Gift = require("../../../models/giftModel");

const getAllIGifts = async (req, res, next) => {
    // console.log("getAllIGifts -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { is_deleted: false, status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const allData = await Gift.find(findConditions).lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-is_deleted -__v")

        res.status(200).json({
            status: true,
            message: "gift listing",
            total_data: allData.length,
            total_pages: Math.ceil(allData.length / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllIGifts;