const { isValidObjectId } = require("mongoose");
const User = require("../../models/userModel");
const { ApiError } = require("../../errorHandler/apiErrorHandler");
const Post = require("../../models/postModel");

const deleteUser = async (req, res, next) => {
    // console.log('deleteUser', req.query.user_id);
    try {
        let user = req.user;

        let deletedPost = await Post.updateMany({ posted_by: user._id }, { is_deleted: true });

        user.is_deleted = true;
        user.name = 'Shortbit user';
        user.email = null;
        user.phone_number = null;
        await user.save();

        res.json({ status: true, message: 'user deleted successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = deleteUser;

