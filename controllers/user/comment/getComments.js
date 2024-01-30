const Comment = require("../../../models/commentModel");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const { isValidObjectId } = require("mongoose");

const getComments = async (req, res, next) => {
    // console.log("getComments -------------------------->")
    try {
        let { post_id, page, limit } = req.query;
        if (!post_id) throw new ApiError("post id is required!", 400);
        if (!isValidObjectId(post_id)) throw new ApiError("invalid id format!", 400);

        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { post_id, is_deleted: false, status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const comments = await Comment.find(findConditions)
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('user_id', 'name profile_image')
            .select("-is_deleted -__v")

        res.status(200).json({
            status: true,
            message: "comment listing",
            total_data: comments.length,
            total_pages: Math.ceil(comments.length / limit),
            data: comments,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getComments;