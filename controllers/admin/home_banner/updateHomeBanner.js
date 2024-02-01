const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const imageUpload = require("../../../utils/imageUpload");
const getBaseUrl = require("../../../utils/getBaseUrl");
const HomeBanner = require("../../../models/homeBannerModel");

const updateHomeBanner = async (req, res, next) => {
    // console.log("updateHomeBanner -------------------------->", req.body);
    imageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            let { id, priority } = req.body;
            if (!id) throw new ApiError("ID is required!", 400);
            if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

            let updatedObj = {};
            if (priority) updatedObj.priority = priority;
            if (req.file) updatedObj.banner_image = getBaseUrl() + "/image/" + req.file.filename;

            let updatedRecord = await HomeBanner.findByIdAndUpdate(id, updatedObj, { new: true }).lean();
            if (!updatedRecord) throw new ApiError("No document found with this ID", 404);
            res.status(200).json({ status: true, message: "document updated sucessfully.", data: updatedRecord });
        } catch (error) {
            next(error);
        }
    });
}

module.exports = updateHomeBanner;