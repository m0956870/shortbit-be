const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: [true, 'user_id is required'] },
        to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
        transaction_type: { type: String, enum: ['credit', 'debit'], required: [true, 'transaction_type is required'] },
        transaction_by: { type: String, enum: ['user', 'host', 'admin', 'agency'], required: [true, 'transaction_by is required'] },
        item_type: { type: String, enum: ['gift', 'coin', 'recharge'], required: [true, 'item_type is required'] },
        amount: { type: Number, default: 0, },
        item: { type: Object },
    },
    {
        timestamps: true,
        collection: 'transaction'
    }
)

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;