const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const HomeBanner = require("../../../models/homeBannerModel");

const deleteHomeBanner = async (req, res, next) => {
    // console.log("deleteHomeBanner -------------------------->")
    try {
        const deletedData = await HomeBanner.findByIdAndDelete(req.params.id).lean()
        if(!deletedData) throw new ApiError('no document found with this id', 400)
        res.status(200).json({ status: true, message: "document deleted successfully.", data: deletedData, });
    } catch (error) {
        next(error);
    }
}

module.exports = deleteHomeBanner;