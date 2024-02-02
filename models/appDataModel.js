const mongoose = require('mongoose');

const appDataModel = new mongoose.Schema(
    {
        key: { type: String, required: [true, 'key is required'] },
        title: { type: String, required: [true, 'title is required'] },
        value: { type: String, required: [true, 'value is required'] },
        status: { type: Boolean, default: true,},
    },
    {
        timestamps: true,
        collection: 'app_data'
    },
)

const AppData = mongoose.model('app_data', appDataModel);
module.exports = AppData;

// terms_and_conditions
// privacy_policy