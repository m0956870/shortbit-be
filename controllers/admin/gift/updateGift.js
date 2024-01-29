const { isValidObjectId } = require("mongoose");
const Gift = require("../../../models/giftModel");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const imageUpload = require("../../../utils/imageUpload");
const getBaseUrl = require("../../../utils/getBaseUrl");

const updateGift = async (req, res, next) => {
    // console.log("updateGift -------------------------->", req.body);
    imageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            let { id, name, value, coins } = req.body;
            if (!id) throw new ApiError("ID is required!", 400);
            if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

            let updatedObj = {};
            if (name) updatedObj.name = name;
            if (value) updatedObj.value = value;
            if (coins) updatedObj.coins = coins;
            if (req.file) updatedObj.icon = getBaseUrl() + "/image/" + req.file.filename;

            let updatedRecord = await Gift.findByIdAndUpdate(id, updatedObj, { new: true }).lean();
            if (!updatedRecord) throw new ApiError("No document found with this ID", 404);
            res.status(200).json({ status: true, message: "Gift updated sucessfully.", data: updatedRecord });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = updateGift;