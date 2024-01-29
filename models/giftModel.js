const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'name is required'] },
        icon: { type: String, default: '' },
        value: { type: Number, required: [true, 'value is required'] },
        coins: { type: Number, required: [true, 'coins is required'] },
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