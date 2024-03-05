const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        title: { type: String, default: null },
        body: { type: String, default: null },
        from: { type: mongoose.Types.ObjectId, ref: 'users' },
        to: { type: mongoose.Types.ObjectId, ref: 'users' },
        for: { type: String, default: null, },
        image: { type: String, default: null },
        status: { type: Boolean, default: true, },
    },
    { timestamps: true },
)

const Notification = mongoose.model('notification', notificationSchema);
module.exports = Notification;