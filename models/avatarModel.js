const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        icon: { type: String },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, },
    },
    { timestamps: true }
);

const Avatar = mongoose.model('avatar', avatarSchema);
module.exports = Avatar;