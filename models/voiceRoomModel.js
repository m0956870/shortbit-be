const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        host_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: [true, 'host id is required'] },
        start_time: { type: Date, default: Date.now },
        end_time: { type: Date, default: '' },
        users: [String],
        users_token: [String],
        slot_users: {
            "1": { type: Object, default: null },
            "2": { type: Object, default: null },
            "3": { type: Object, default: null },
            "4": { type: Object, default: null },
            "5": { type: Object, default: null },
            "6": { type: Object, default: null },
            "7": { type: Object, default: null },
            "8": { type: Object, default: null },
        },
        peak_view_count: { type: Number, default: 0 },
        earned_coins: { type: Number, default: 0 },
        last_active_time: { type: Date, default: Date.now },
        scheduler_id: { type: Number, default: null },
        status: { type: String, default: 'ongoing', enum: ['ongoing', 'ended'] },
    },
    { timestamps: true }
);

const VoiceRoom = mongoose.model('voiceroom', schema);
module.exports = VoiceRoom;