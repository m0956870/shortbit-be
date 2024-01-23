const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Follow = require("../../../models/followModel");
const User = require("../../../models/userModel");

const followUser = async (req, res, next) => {
    try {
        let { following_id } = req.params;
        if (!following_id) throw new ApiError("following user id is required", 400)
        if (!isValidObjectId(following_id)) throw new ApiError("Invalid ID format", 400);
        let rootUser = req.user;

        let oldRecord = await Follow.findOne({ follower_id: rootUser._id, following_id, })
        if (!oldRecord) {
            let userFollowing = await User.findByIdAndUpdate(following_id, { $inc: { followers_count: 1 } }, { new: true })
            if (!userFollowing) throw new ApiError("no user found with this ID, 404");
            await Follow.create({ follower_id: rootUser._id, following_id, });

            rootUser.following_count = rootUser.following_count + 1
            rootUser.save();

            res.status(201).json({ status: true, message: "User followed successfully" })
        } else {
            let userFollowing = await User.findByIdAndUpdate(following_id, { $inc: { followers_count: -1 } }, { new: true })
            if (!userFollowing) throw new ApiError("no user found with this ID, 404");
            await Follow.deleteOne({ follower_id: rootUser._id, following_id, });
            rootUser.following_count = rootUser.following_count - 1
            rootUser.save();

            res.status(201).json({ status: true, message: "User unfollowed successfully" })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = followUser;