const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
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
        otp: { type: String, default: '' },
        otp_expiry: { type: String, default: '' },
        balance: { type: Number, default: 0 },

        phone_number: { type: String, default: '' },
        profile_image: { type: String, default: '' },
        role: { type: String, default: 'sub_admin' },
        account_status: { type: String, default: 'active' },
        is_deleted: { type: Boolean, default: false, },
    },
    { timestamps: true }
);

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcrypt');
        const saltRounds = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;