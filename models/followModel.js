const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        follower_id: { type: mongoose.Types.ObjectId, ref: 'user', required: [true, 'follower id is required!'] },
        following_id: { type: mongoose.Types.ObjectId, ref: 'user', required: [true, 'following id is required!'] },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, },
    },
    { timestamps: true },
)

const Post = mongoose.model('post', postSchema);
module.exports = Post;