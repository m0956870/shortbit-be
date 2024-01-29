const Avatar = require("../../../models/avatarModel");

const getAllAvatar = async (req, res, next) => {
    // console.log("getAllAvatar -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        // const findConditions = { is_deleted: false, status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const allData = await Avatar.find().lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-is_deleted -__v")

        res.status(200).json({
            status: true,
            message: "All avatar fetched successfully.",
            total_data: allData.length,
            total_pages: Math.ceil(allData.length / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllAvatar;