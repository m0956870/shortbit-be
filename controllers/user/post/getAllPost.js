const Post = require("../../../models/postModel");
const mongoose = require("mongoose");

const getAllPost = async (req, res, next) => {
    try {
        let { page, limit } = req.query;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 10;

        const findConditions = { is_deleted: false, status: true };

        const pipeline = [
            { $match: findConditions },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "likes"
                }
            },
            {
                $addFields: {
                    total_likes: { $size: "$likes" },
                    is_liked: {
                        $cond: {
                            if: { $in: [new mongoose.Types.ObjectId(req.user.id), "$likes.user_id"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            { $unset: "likes" },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ];

        const postsWithLikes = await Post.aggregate(pipeline);

        const totalCountPipeline = [
            { $match: findConditions },
            { $count: "total_data" }
        ];

        const [{ total_data: totalPosts }] = await Post.aggregate(totalCountPipeline);

        res.status(200).json({
            status: true,
            message: "All posts fetched successfully.",
            total_data: totalPosts,
            total_pages: Math.ceil(totalPosts / limit),
            data: postsWithLikes,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = getAllPost;