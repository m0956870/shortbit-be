const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Types.ObjectId, ref: 'user' },
        post_id: { type: mongoose.Types.ObjectId, ref: 'post' },
        text: { type: String, required: [true, 'text is required'] },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, }
    },
    { timestamps: true },
);

const Comment = mongoose.model('comment', schema);
module.exports = Comment;