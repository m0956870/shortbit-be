const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        posted_by: { type: mongoose.Types.ObjectId, ref: 'user' },
        title: { type: String, default: '' },
        video_src: { type: String, required: [true, 'video src is required!'] },
        audio_src: { type: String },
        // audio_src: { type: String, required: [true, 'audio src is required!'] },
        likes: { type: String, default: '0' },
        comments: { type: String, default: '0' },
        share: { type: String, default: '0' },
        views: { type: String, default: '0' },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, }
    },
    { timestamps: true },
)

const Post = mongoose.model('post', postSchema);
module.exports = Post;