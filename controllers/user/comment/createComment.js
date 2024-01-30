const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Post = require("../../../models/postModel");
const Comment = require("../../../models/commentModel");

const createComment = async (req, res, next) => {
    try {
        let { post_id, text } = req.body;
        if (!post_id) throw new ApiError("post id is required", 400)
        if (!isValidObjectId(post_id)) throw new ApiError("Invalid ID format", 400);
        if (!text) throw new ApiError("text is required", 400)

        let postRecord = await Post.findByIdAndUpdate(post_id, { $inc: { comments: 1 } }, { new: true });
        if (!postRecord) throw new ApiError("no post found with this ID, 404");
        await Comment.create({ user_id: req.user._id, post_id, text });

        res.status(200).json({ status: true, message: "comment created successfully" })
    } catch (error) {
        next(error)
    }
}

module.exports = createComment;