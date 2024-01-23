const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Post = require("../../../models/postModel");
const ViewPost = require("../../../models/viewModel");

const viewPost = async (req, res, next) => {
    try {
        let { post_id } = req.params;
        if (!post_id) throw new ApiError("post id is required", 400)
        if (!isValidObjectId(post_id)) throw new ApiError("Invalid ID format", 400);
        let rootUser = req.user;

        let postViewCount = await Post.findByIdAndUpdate(post_id, { $inc: { views: 1 } }, { new: true });
        if (!postViewCount) throw new ApiError("no post found with this ID, 404");
        await ViewPost.create({ user_id: rootUser._id, post_id });

        res.status(200).json({ status: true, message: "Post shared successfully" })
    } catch (error) {
        next(error)
    }
}

module.exports = viewPost;