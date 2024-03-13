const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");
const Post = require("../../../models/postModel");

const deleteUser = async (req, res, next) => {
    // console.log('deleteUser', req.params.id);
    try {
        let user_id = req.params.id;
        if (!user_id) throw new ApiError("user id is required", 400)
        if (!isValidObjectId(user_id)) throw new ApiError("Invalid ID format", 400);

        let user = await User.findById(user_id);
        if (!user) throw new ApiError('no user found', 404);

        let deletedPost = await Post.updateMany({ posted_by: user_id }, { is_deleted: true });
F
        user.is_deleted = true;
        user.name = 'Shortbit user';
        user.email = null;
        user.phone_number = null;
        user.save();

        res.json({status: true, message: 'user deleted successfully'});
    } catch (error) {
        next(error);
    }
}


module.exports = deleteUser;