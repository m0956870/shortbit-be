const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Gift = require("../../../models/giftModel");

const deleteGift = async (req, res, next) => {
    console.log("deleteGift -------------------------->", req.params)
    try {
        const deletedData = await Gift.findByIdAndDelete(req.params.id).lean();
        if(!deletedData) throw new ApiError('no record found with this id', 400)
        res.status(200).json({ status: true, message: "gift deleted successfully.", data: deletedData, });
    } catch (error) {
        next(error);
    }
}

module.exports = deleteGift;