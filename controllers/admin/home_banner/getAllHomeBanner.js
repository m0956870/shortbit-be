const HomeBanner = require("../../../models/homeBannerModel");

const getAllHomeBanner = async (req, res, next) => {
    // console.log("getAllHomeBanner -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        // const findConditions = { is_deleted: false, status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const totalData = await HomeBanner.countDocuments();
        const allData = await HomeBanner.find().lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ priority: 1 })
            .select("-is_deleted -__v")

        res.status(200).json({
            status: true,
            message: "documets listing",
            total_data: totalData,
            total_pages: Math.ceil(totalData / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllHomeBanner;