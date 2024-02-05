const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema(
    {
        host_id: { type: mongoose.Types.ObjectId, ref: 'user', required: [true, 'host id is required!'] },
        agency_id: { type: mongoose.Types.ObjectId, ref: 'agency', required: [true, 'agency id is required!'] },
        amount: { type: Number, required: [true, 'amount is required'] },
        status: { type: String, default: 'pending', enum: ['pending', 'settled'] },
    },
    {
        timestamps: true,
        collection: 'settlements'
    },
);

const Settlement = mongoose.model('settlement', settlementSchema);
module.exports = Settlement;

