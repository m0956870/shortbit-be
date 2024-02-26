const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        posted_by: { type: mongoose.Types.ObjectId, ref: 'user' },
        title: { type: String, default: '' },
        video_src: { type: String, required: [true, 'video src is required!'] },
        audio_src: { type: String },
        // audio_src: { type: String, required: [true, 'audio src is required!'] },
        // is_liked: { type: Boolean, default: false },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        share: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        approved_time: { type: Date, default: null },
        is_deleted: { type: Boolean, default: false, },
        status: { type: String, default: 'unapproved', enum: ['approved', 'unapproved'] }
    },
    { timestamps: true },
);

const Post = mongoose.model('post', postSchema);
module.exports = Post;
