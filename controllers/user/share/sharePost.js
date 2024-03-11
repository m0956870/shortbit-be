const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const SharePost = require("../../../models/sharePostModel");
const Post = require("../../../models/postModel");
const User = require("../../../models/userModel");

const sharePost = async (req, res, next) => {
    try {
        let { post_id, to } = req.body;
        if (!post_id) throw new ApiError("post id is required", 400)
        if (!isValidObjectId(post_id)) throw new ApiError("Invalid ID format", 400);
        if (!to) throw new ApiError("to user id is required", 400)
        if (!isValidObjectId(to)) throw new ApiError("Invalid to user ID format", 400);
        let toUser = await User.findById(to);
        if (!toUser) throw new ApiError("not user found with to user id", 404);
        if (toUser.is_deleted === true) throw new ApiError("user does not exist", 404);
        let rootUser = req.user;

        let postShareCount = await Post.findByIdAndUpdate(post_id, { $inc: { share: 1 } }, { new: true });
        if (!postShareCount) throw new ApiError("no post found with this ID, 404");
        await SharePost.create({ from: rootUser._id, post_id, to });

        res.status(200).json({ status: true, message: "Post shared successfully" })
    } catch (error) {
        next(error)
    }
}

module.exports = sharePost;