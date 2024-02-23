const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Gift = require("../../../models/giftModel");
const getBaseUrl = require("../../../utils/getBaseUrl");
const multipleImageUpload = require("../../../utils/multipleImageUpload");

const createGift = async (req, res, next) => {
    // console.log("createGift -------------------------->", req.body);
    multipleImageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            const { name, value, coins } = req.body;
            if (!name) throw new ApiError("name is required!", 400);
            if (!value) throw new ApiError("value is required!", 400);
            if (!coins) throw new ApiError("coins is required!", 400);

            let icon;
            let animation_image;
            // if (req.files) icon = getBaseUrl() + "/image/" + req.file.filename;
            if (req.files["image"]) icon = getBaseUrl() + "/image/" +  req.files["image"][0].filename;
            if (req.files["gif_image"]) animation_image = getBaseUrl() + "/image/" + req.files["gif_image"][0].filename;

            const existingRecord = await Gift.findOne({ value }).lean();
            if (existingRecord) throw new ApiError("Gift already exist!", 400);

            const newRecord = await Gift.create({ name, icon, animation_image, value, coins });
            res.status(201).json({ status: true, message: "gift created successfully", data: newRecord });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = createGift;