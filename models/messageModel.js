const mongoose = require('mongoose');

const messageGroupSchema = new mongoose.Schema(
    {
        from_id: { type: mongoose.Types.ObjectId, ref: 'user', required: [true, 'user id is required!'] },
        to_id: { type: mongoose.Types.ObjectId, ref: 'user', required: [true, 'user id is required!'] },
        group_id: { type: String, required: [true, 'group id is required'] },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, },
    },
    { timestamps: true },
)

const MessageGroup = mongoose.model('message_group', messageGroupSchema);
module.exports = MessageGroup;