const mongoose = require('mongoose');

const videoChatSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: [true, 'user id is required'] },
        host_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: [true, 'host id is required'] },
        start_time: { type: Date, default: null },
        end_time: { type: Date, default: null },
        max_min: { type: Number, default: null },
        last_captured_time: { type: String, default: null },
        total_time_in_minutes: { type: Number, default: null },
        user_transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', default: null },
        host_transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', default: null },
        status: { type: String, default: 'initiated', enum: ['initiated', 'ongoing', 'ended'] },
        chat_status: {
            type: String, default: 'user_initiated',
            enum: ['user_initiated', 'user_cancel', 'host_cancel', 'host_accepted', 'user_end', 'host_end',],
        },
    },
    {
        timestamps: true,
        collection: "videochat",
    },
);

const VideoChat = mongoose.model('VideoChat', videoChatSchema);
module.exports = VideoChat;