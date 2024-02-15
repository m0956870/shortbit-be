const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../../errorHandler/apiErrorHandler');
const Post = require('../../../models/postModel');

let statusEnum = ['approved', 'unapproved']

const updatePost = async (req, res, next) => {
    try {
        let { post_id, status } = req.body;
        if (!post_id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(post_id)) throw new ApiError("Invalid ID!", 400);
        if (!statusEnum.includes(status)) throw new ApiError('invalid status type', 400);

        let updatedObj = {}
        if (status) updatedObj.status = status;

        let post = await Post.findByIdAndUpdate(post_id, updatedObj, { new: true });
        if (!post) throw ApiError("no data found with id", 404);
        res.status(200).json({ status: true, message: "post updated successfully!", data: post });
    } catch (error) {
        next(error)
    }
}

module.exports = updatePost;