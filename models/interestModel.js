const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        icon: { type: String, default: "" },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, },
    },
    { timestamps: true }
);

const Interest = mongoose.model('interest', interestSchema);
module.exports = Interest;