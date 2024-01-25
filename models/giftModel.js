const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema(
    {
        value: { type: Number, required: [true, 'value is required'] },
        coins: { type: Number, required: [true, 'coins is required'] },
        icon: { type: String, default: '' },
        is_deleted: { type: Boolean, default: false, },
        status: { type: Boolean, default: true, },
    },
    {
        timestamps: true,
        collection: 'gifts'
    }
);

const Gift = mongoose.model('Gift', giftSchema);
module.exports = Gift;