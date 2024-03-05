const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Post = require("../../../models/postModel");
const Comment = require("../../../models/commentModel");
const Notification = require("../../../models/notificationModel");
const sendNotification = require("../../../utils/sendNotification");

const createComment = async (req, res, next) => {
    try {
        let { post_id, text } = req.body;
        if (!post_id) throw new ApiError("post id is required", 400)
        if (!isValidObjectId(post_id)) throw new ApiError("Invalid ID format", 400);
        if (!text) throw new ApiError("text is required", 400)
        const post = await Post.findById(post_id).populate("posted_by")
        if (!post) throw new ApiError("no post found with this ID, 404");
        let rootUser = req.user;

        // let postRecord = await Post.findByIdAndUpdate(post_id, { $inc: { comments: 1 } }, { new: true });
        post.comments = post.comments + 1;
        post.save();
        await Comment.create({ user_id: req.user._id, post_id, text });

        await Notification.create({
            title: `${rootUser.name} commented on your post`,
            body: `${rootUser.name} commented on your post`,
            from: req.user._id,
            to: post?.posted_by?._id,
            for: 'comment',
        })
        await sendNotification(post?.posted_by?.device_token,
            {
                body: `${rootUser.name} commented on your post`,
                title: `${rootUser.name} commented on your post`,
                type: "comment_post_user_notification",
                user_type: rootUser.user_type, //vip/normal/vvip/
            },
            {
                body: `${rootUser.name} commented on your post`,
                title: `${rootUser.name} commented on your post`,
                type: "comment_post_user_notification",
                user_type: rootUser.user_type, //vip/normal/vvip/
                click_action: "",
                image_url: "",
                notification_type: "",
            }
        )

        res.status(200).json({ status: true, message: "comment created successfully" })
    } catch (error) {
        next(error)
    }
}

module.exports = createComment;