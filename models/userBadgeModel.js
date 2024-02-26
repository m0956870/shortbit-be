const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'name is required'] },
        monthly_expense_limit: { type: Number, required: [true, 'monthly_expense_limit is required'] },
        badge_image: { type: String, default: null },
        animation_image: { type: String, default: null },
    },
    { timestamps: true },
);

const UserBadge = mongoose.model('user_badge', schema);
module.exports = UserBadge;