const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        title: { type: String, default: null },
        body: { type: String, default: null },
        for: { type: String, default: null, },
        image: { type: String, default: null },
        status: { type: Boolean, default: true, },
    },
    { timestamps: true },
)

const Notification = mongoose.model('notification', notificationSchema);
module.exports = Notification;