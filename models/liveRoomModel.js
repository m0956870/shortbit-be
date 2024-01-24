const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        host_id: { type: String, required: [true, 'host id is required'] },
        start_time: { type: Date, default: Date.now },
        end_time: { type: Date, default: '' },
        last_active_time: { type: Date, default: Date.now() },
        users: [String],
        peak_view_count: { type: Number, default: 0 },
        status: { type: String, default: 'ongoing', enum: ['ongoing', 'ended'] } // ongoing / ended
    },
    { timestamps: true }
);

const LiveRoom = mongoose.model('liveroom', schema);
module.exports = LiveRoom;