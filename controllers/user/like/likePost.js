const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Like = require("../../../models/likeModel");
const Post = require("../../../models/postModel");

const likePost = async (req, res, next) => {
    try {
        let { post_id } = req.params;
        if (!post_id) throw new ApiError("post id is required", 400)
        if (!isValidObjectId(post_id)) throw new ApiError("Invalid ID format", 400);
        let rootUser = req.user;

        let oldRecord = await Like.findOne({ user_id: rootUser._id, post_id, })
        if (!oldRecord) {
            // let postLikeCount = await Post.findByIdAndUpdate(post_id, { $inc: { likes: 1 } }, { new: true });
            // if (!postLikeCount) throw new ApiError("no post found with this ID, 404");
            await Like.create({ user_id: rootUser._id, post_id });
            
            res.status(200).json({ status: true, message: "Post liked successfully" })
        } else {
            // let postLikeCount = await Post.findByIdAndUpdate(post_id, { $inc: { likes: -1 } }, { new: true })
            // if (!postLikeCount) throw new ApiError("no post found with this ID, 404");
            await Like.deleteOne({ user_id: rootUser._id, post_id, });
            
            res.status(200).json({ status: true, message: "Post unlike successfully" })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = likePost;