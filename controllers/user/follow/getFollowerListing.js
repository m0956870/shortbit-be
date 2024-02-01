const { isValidObjectId, default: mongoose } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Follow = require("../../../models/followModel");

const getFollowerListing = async (req, res, next) => {
    try {
        let { user_id } = req.query;
        if (!user_id) throw new ApiError("user id is required", 400)
        if (!isValidObjectId(user_id)) throw new ApiError("Invalid ID format", 400);

        let { page, limit } = req.query;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 10;
        
        const findCondition =  { 'following_id': new mongoose.Types.ObjectId(user_id) };

        const followers = await Follow.aggregate([
            { $match: findCondition },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "follower_id",
                    foreignField: "_id",
                    as: "followers"
                }
            },
            {
                $addFields: {
                    followers: { $arrayElemAt: ['$followers', 0] }
                }
            },
            {
                $project: {
                    _id: 0,
                    followers: {
                        name: 1,
                        profile_image: 1,
                    },
                }
            }
        ]);

        const totalData = await Follow.countDocuments(findCondition);
        res.status(200).json({
            status: true,
            message: "All followers..",
            total_data: totalData,
            total_pages: Math.ceil(totalData / limit),
            data: followers,
        });
    } catch (error) {
        next(error)
    }
}

module.exports = getFollowerListing;