const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name: { type: String, default: null },
        package_image: { type: String, default: null },
        amount: { type: Number, required: [true, 'amount is required'] },
        coin: { type: Number, required: [true, 'coin is required'] },
        add_on_package: { type: String, enum: ['vip', 'vvip', 'svip'], required: [true, 'add_on_package is required'] },
        status: { type: Boolean, default: true },
    },
    { timestamps: true },
);

const WalletPackage = mongoose.model('wallet_package', schema);
module.exports = WalletPackage;