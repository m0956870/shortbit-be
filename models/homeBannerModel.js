const mongoose = require('mongoose');

const homeBannerSchema = new mongoose.Schema(
    {
        banner_image: { type: String, required: [true, 'image is required'] },
        priority: { type: Number, default: 1 },
        status: { type: Boolean, default: true, },
    },
    { timestamps: true }
);

const HomeBanner = mongoose.model('home_banner', homeBannerSchema);
module.exports = HomeBanner;