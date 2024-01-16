const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        email: {
            type: String, unique: true, required: [true, 'Email is required!'], lowercase: true,
            validate: {
                validator: (val) => /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val),
                message: 'Invalid email format',
            }
        },
        password: { type: String, minlength: 6, required: [true, "Password is required!"] },
        phone_number: { type: String, default: "" },
        agency_code: { type: String, required: [true, 'Code is required!'] },
        profile_image: { type: String, default: "" },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, }
    },
    { timestamps: true }
);

agencySchema.pre('save', async function (next) {
    const bcrypt = require('bcrypt');
    const saltRounds = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

const Agency = mongoose.model('agency', agencySchema);
module.exports = Agency;