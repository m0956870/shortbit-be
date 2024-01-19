const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        email: {
            type: String, unique: true, required: [true, 'Email is required!'], lowercase: true,
            validate: {
                validator: (val) => /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val),
                message: 'Invalid email format',
            }
        },
        password: { type: String, minlength: 6, required: [true, 'Password is required!'] },
        forget_password_otp: { type: String },
        phone_number: { type: String, default: '' },
        signup_otp: { type: String, default: '' },
        signup_otp_expiry: { type: String, default: '' },

        detail_count: { type: String, default: '5' },
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
        role: { type: String, default: 'user' },
        agency_code: { type: String },
        detail_status: { type: String, default: 'incomplete', },
        account_status: { type: String, default: 'active' },
        is_deleted: { type: Boolean, default: false, },
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