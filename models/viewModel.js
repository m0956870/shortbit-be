const mongoose = require('mongoose');

const viewPostSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Types.ObjectId, ref: 'user', required: [true, 'user id is required!'] },
        post_id: { type: mongoose.Types.ObjectId, ref: 'post', required: [true, 'post id is required!'] },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, },
    },
    { timestamps: true },
)

const ViewPost = mongoose.model('viewpost', viewPostSchema);
module.exports = ViewPost;