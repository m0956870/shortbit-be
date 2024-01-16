const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        email: { type: String, unique: true, required: [true, 'Email is required!'], lowercase: true, },
        password: { type: String, required: [true, 'Password is required!'] },
        forget_password_otp: { type: String },
        phone_number: { type: String, default: '' },

        detail_count: { type: String, default: '5' },
        gender: { type: String, default: '' },
        age: { type: String, default: '' },
        interest: [{ type: mongoose.Schema.Types.ObjectId, ref: 'interest' }],
        profile_image: { type: String, default: '' },
        location: {
            name: { type: String, default: '' },
            lat: { type: String, default: '' },
            long: { type: String, default: '' },
        },
        
        gallery: [{ type: String }],
        role: { type: String, default: 'host' },
        agency_code: { type: String, required: [true, 'Agency code is required!'] },
        detail_status: { type: String, default: 'incomplete', },
        account_status: { type: String, default: 'unapproved' },
        is_deleted: { type: Boolean, default: false, },
    },
    { timestamps: true }
);

const Host = mongoose.model('host', hostSchema);
module.exports = Host;