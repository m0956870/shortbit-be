const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        email: { type: String, unique: true, lowercase: true, },
        password: { type: String },
        forget_password_otp: { type: String },
        phone_number: { type: String, default: '' },
        otp: { type: String, default: '' },
        otp_expiry: { type: String, default: '' },
        device_token: { type: String, default: '' },

        gender: { type: String, default: '' },
        dob: { type: String, default: '' },
        interest: [{ type: mongoose.Schema.Types.ObjectId, ref: 'interest' }],
        height: { type: String, default: '' },
        // language: [{ type: mongoose.Schema.Types.ObjectId, ref: 'language' }],
        language: { type: String, default: 'English' },
        profile_image: { type: String, default: '' },
        avtar: { type: String, default: '' },
        location: {
            name: { type: String, default: '' },
            lat: { type: String, default: '' },
            long: { type: String, default: '' },
        },
        user_id: { type: String, required: [true, 'user id is required'], unique: true, },
        user_name: { type: String, required: [true, 'username is required'], unique: true, },
        about_me: { type: String, default: '' },
        
        gallery: [{ type: String }],
        age: { type: String, default: '' },
        detail_count: { type: String, default: '0' },
        detail_status: { type: String, default: 'incomplete', },
        account_status: { type: String, default: 'active', enum: ['active', 'inactive', 'blocked', 'unapproved', 'approved'] },
        service_status: { type: String, default: 'active', enum: ['active', 'inactive'] },
        is_online: { type: Boolean, default: false },

        followers_count: { type: Number, default: 0 },
        following_count: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },

        user_monthly_debit: { type: Number, default: 0 },
        user_type: { type: String, default: 'normal' },
        purchased_monthly_debit_limit: { type: Number, default: 0 },

        host_monthly_credit: { type: Number, default: 0 },
        level: { type: Number, default: 0 },

        blocked_users: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
        role: { type: String, default: 'user' },
        // host
        agency_code: { type: String },
        price_per_min: { type: Number, default: 0 },
        commission: { type: Number, default: 0 },
        // liveroom
        is_live_busy: { type: Boolean, default: false },
        live_room_id: { type: mongoose.Types.ObjectId, ref: 'liveroom', default: null },
        // voiceroom
        is_voice_busy: { type: Boolean, default: false },
        voice_room_id: { type: mongoose.Types.ObjectId, ref: 'voiceroom', default: null },
        // videochat
        is_video_busy: { type: Boolean, default: false },
        video_chat_id: { type: mongoose.Types.ObjectId, ref: 'videochat', default: null },

        signup_source: { type: String, default: 'app' },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcrypt');
        const saltRounds = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

const User = mongoose.model('user', userSchema);
module.exports = User;