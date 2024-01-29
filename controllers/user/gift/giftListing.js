const Gift = require("../../../models/giftModel");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const giftListing = async (req, res, next) => {
    try {
        let gift = await Gift.find({is_deleted:false,status:true});
        if (!gift) throw new ApiError("No gift available right now", 400);

        res.status(200).json({ status: true, message: 'gift Listing',gift });
    } catch (error) {
        next(error);
    }
}

module.exports = giftListing;