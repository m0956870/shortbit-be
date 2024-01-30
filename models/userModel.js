const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        email: { type: String, unique: true, required: [true, 'Email is required!'], lowercase: true, },
        password: { type: String, minlength: 6, required: [true, 'Password is required!'] },
        forget_password_otp: { type: String },
        phone_number: { type: String, default: '' },
        otp: { type: String, default: '' },
        otp_expiry: { type: String, default: '' },

        detail_count: { type: String, default: '0' },
        gender: { type: String, default: '' },
        dob: { type: String, default: '' },
        interest: [{ type: mongoose.Schema.Types.ObjectId, ref: 'interest' }],
        profile_image: { type: String, default: '' },
        location: {
            name: { type: String, default: '' },
            lat: { type: String, default: '' },
            long: { type: String, default: '' },
        },

        gallery: [{ type: String }],
        age: { type: String, default: '' },
        detail_status: { type: String, default: 'incomplete', },
        account_status: { type: String, default: 'active', enum: ['active', 'unapproved', 'approved'] },

        followers_count: { type: Number, default: 0 },
        following_count: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },

        role: { type: String, default: 'user' },
        level: { type: Number, default: 1 },
        // host
        agency_code: { type: String },
        price_per_min: { type: Number, default: 0 },
        is_live_busy: { type: Boolean, default: false },
        is_chat_busy: { type: Boolean, default: false },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    const bcrypt = require('bcrypt');
    const saltRounds = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

const User = mongoose.model('user', userSchema);
module.exports = User;