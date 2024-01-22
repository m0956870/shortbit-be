const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema(
    {
        posted_by: { type: mongoose.Types.ObjectId, ref: 'admin' },
        title: { type: String, default: '' },
        audio_src: { type: String, required: [true, 'audio src is required!'] },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, }
    },
    { timestamps: true },
)

const Audio = mongoose.model('audio', audioSchema);
module.exports = Audio;