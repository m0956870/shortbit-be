const AppData = require("../../../models/appDataModel");

const getAllAppData = async (req, res, next) => {
    // console.log("getAllAppData -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const totalData = await AppData.countDocuments(findConditions);
        const allData = await AppData.find(findConditions).lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-__v")

        res.status(200).json({
            status: true,
            message: "app data listing",
            total_data: totalData,
            total_pages: Math.ceil(totalData / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllAppData;