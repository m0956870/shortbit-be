const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        host_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: [true, 'host id is required'] },
        start_time: { type: Date, default: Date.now },
        end_time: { type: Date, default: '' },
        users: [String],
        peak_view_count: { type: Number, default: 0 },
        last_active_time: { type: Date, default: Date.now() },
        scheduler_id: { type: Number, default: null },
        status: { type: String, default: 'ongoing', enum: ['ongoing', 'ended'] } // ongoing / ended
    },
    { timestamps: true }
);

const LiveRoom = mongoose.model('liveroom', schema);
module.exports = LiveRoom;