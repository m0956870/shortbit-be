const { isValidObjectId } = require("mongoose");
const Gift = require("../../../models/giftModel");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const updateGift = async (req, res, next) => {
    // console.log("updateGift -------------------------->", req.body);
    try {
        let { id, value, coins } = req.body;
        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

        let updatedObj = {};
        if (value) updatedObj.value = value;
        if (coins) updatedObj.coins = coins;

        let updatedRecord = await Gift.findByIdAndUpdate(id, updatedObj, { new: true }).lean();
        if (!updatedRecord) throw new ApiError("No document found with this ID", 404);
        res.status(200).json({ status: true, message: "Gift updated sucessfully.", data: updatedRecord });
    } catch (error) {
        next(error);
    }
}

module.exports = updateGift;