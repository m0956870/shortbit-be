const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Like = require("../../../models/likeModel");
const Post = require("../../../models/postModel");
const Notification = require("../../../models/notificationModel");
const sendNotification = require("../../../utils/sendNotification");

const likePost = async (req, res, next) => {
    try {
        let { post_id } = req.params;
        if (!post_id) throw new ApiError("post id is required", 400)
        if (!isValidObjectId(post_id)) throw new ApiError("Invalid ID format", 400);
        const post = await Post.findById(post_id).populate("posted_by")
        if (!post) throw new ApiError("no post found with this ID, 404");
        let rootUser = req.user;

        let oldRecord = await Like.findOne({ user_id: rootUser._id, post_id, })
        if (!oldRecord) {
            await Like.create({ user_id: rootUser._id, post_id });

            await Notification.create({
                title: `${rootUser.name} liked your post`,
                body: `${rootUser.name} liked your post`,
                from: req.user._id,
                to: post?.posted_by?._id,
                for: 'like',
            })
            await sendNotification(post?.posted_by?.device_token,
                {
                    body: `${rootUser.name} liked your post`,
                    title: `${rootUser.name} liked your post`,
                    type: "like_post_user_notification",
                    user_type: rootUser.user_type, //vip/normal/vvip/
                },
                {
                    body: `${rootUser.name} liked your post`,
                    title: `${rootUser.name} liked your post`,
                    type: "like_post_user_notification",
                    user_type: rootUser.user_type, //vip/normal/vvip/
                    click_action: "",
                    image_url: "",
                    notification_type: "",
                }
            )

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