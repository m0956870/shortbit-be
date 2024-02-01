const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Comment = require("../../../models/commentModel");
const Post = require("../../../models/postModel");

const deleteComment = async (req, res, next) => {
    // console.log("deleteComment -------------------------->")
    try {
        const deletedData = await Comment.findByIdAndDelete(req.params.id).lean();
        if (!deletedData) throw new ApiError('no comment found with this id', 400)
        await Post.findByIdAndUpdate(deletedData.post_id, { $inc: { comments: -1 } })
        res.status(200).json({ status: true, message: "comment deleted successfully.", });
    } catch (error) {
        next(error);
    }
}

module.exports = deleteComment;