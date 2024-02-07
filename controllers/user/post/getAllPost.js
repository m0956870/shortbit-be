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
                $lookup: {
                    from: "users",
                    localField: "posted_by",
                    foreignField: "_id",
                    as: "posted_by"
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
                    },
                    posted_by: { $first: '$posted_by' }
                }
            },
            { $unset: "likes" },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $project: {
                    "_id": 1,
                    "posted_by": {
                        "_id": 1,
                        "name": 1,
                        "level": 1,
                    },
                    "title": 1,
                    "video_src": 1,
                    "comments": 1,
                    "share": 1,
                    "views": 1,
                    "createdAt": 1,
                    "total_likes": 1,
                    "is_liked": 1,
                }
            }
        ];

        const postsWithLikes = await Post.aggregate(pipeline);
        const total_data = await Post.countDocuments(findConditions);

        res.status(200).json({
            status: true,
            message: "All posts fetched successfully.",
            total_data: total_data,
            total_pages: Math.ceil(total_data / limit),
            data: postsWithLikes,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = getAllPost;