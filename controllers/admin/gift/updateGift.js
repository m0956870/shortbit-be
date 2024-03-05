const { isValidObjectId } = require("mongoose");
const Gift = require("../../../models/giftModel");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const multipleImageUpload = require("../../../utils/multipleImageUpload");
const getBaseUrl = require("../../../utils/getBaseUrl");

const updateGift = async (req, res, next) => {
    // console.log("updateGift -------------------------->", req.body);
    multipleImageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            let { id, name, value, coins } = req.body;
            if (!id) throw new ApiError("ID is required!", 400);
            if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

            let updatedObj = {};
            if (name) updatedObj.name = name;
            if (value) updatedObj.value = value;
            if (coins) updatedObj.coins = coins;
            if (req.files["image"]) updatedObj.icon = getBaseUrl() + "/image/" + req.files["image"][0].filename;
            if (req.files["gif_image"]) updatedObj.animation_image = getBaseUrl() + "/image/" + req.files["gif_image"][0].filename;

            let updatedRecord = await Gift.findByIdAndUpdate(id, updatedObj, { new: true }).lean();
            if (!updatedRecord) throw new ApiError("No document found with this ID", 404);
            res.status(200).json({ status: true, message: "Gift updated sucessfully.", data: updatedRecord });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = updateGift;