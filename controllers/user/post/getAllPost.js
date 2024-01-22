const Post = require("../../../models/postModel");

const getAllPost = async (req, res, next) => {
    // console.log("getAllPost -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { is_deleted: false, status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const post = await Post.find(findConditions)
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-is_deleted -__v")

        if (post.length === 0) res.status(200).json({ status: true, message: "no post found!", data: [] })
        res.status(200).json({
            status: true,
            message: "All post fetched successfully.",
            total_posts: post.length,
            total_pages: Math.ceil(post.length / limit),
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllPost;