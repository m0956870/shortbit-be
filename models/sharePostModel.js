const mongoose = require('mongoose');

const sharePostSchema = new mongoose.Schema(
    {
        from: { type: mongoose.Types.ObjectId, ref: 'user', required: [true, 'from user id is required!'] },
        to: { type: mongoose.Types.ObjectId, ref: 'user', required: [true, 'to user id is required!'] },
        post_id: { type: mongoose.Types.ObjectId, ref: 'post', required: [true, 'post id is required!'] },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, },
    },
    { timestamps: true },
)

const SharePost = mongoose.model('sharepost', sharePostSchema);
module.exports = SharePost;