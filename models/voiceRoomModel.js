const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        host_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: [true, 'host id is required'] },
        start_time: { type: Date, default: Date.now },
        end_time: { type: Date, default: '' },
        users: [String],
        users_token: [],
        requested_slot_users: [],
        slot_users: {
            one: { type: Object, default: null },
            two: { type: Object, default: null },
            three: { type: Object, default: null },
            four: { type: Object, default: null },
            five: { type: Object, default: null },
            six: { type: Object, default: null },
            seven: { type: Object, default: null },
            eight: { type: Object, default: null },
        },
        peak_view_count: { type: Number, default: 0 },
        earned_coins: { type: Number, default: 0 },
        last_active_time: { type: Date, default: Date.now },
        scheduler_id: { type: Number, default: null },
        blocked_users: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
        status: { type: String, default: 'ongoing', enum: ['ongoing', 'ended'] },
    },
    { timestamps: true }
);

const VoiceRoom = mongoose.model('voiceroom', schema);
module.exports = VoiceRoom;