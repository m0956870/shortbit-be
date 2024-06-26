const User = require("../../../models/userModel");

const getAllUserListing = async (req, res, next) => {
    // console.log("getAllUserListing -------------------------->")
    try {
        let { page, limit, user_id } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { role: 'user', is_deleted: false };
        if (user_id) findConditions.user_id = { $regex: new RegExp(user_id, "i") };

        // let allData = await User.aggregate([
        //     { $match: findConditions },
        //     { $skip: (page * limit) - limit },
        //     { $limit: Number(limit) },
        //     { $sort: { createdAt: 1 } },
        // ])
        
        // let [{ dataCount }] = await User.aggregate([
        //     { $match: findConditions },
        //     { $count: 'dataCount' }
        // ])

        let dataCount = await User.countDocuments(findConditions);
        const allData = await User.find(findConditions)
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

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

module.exports = getAllUserListing;