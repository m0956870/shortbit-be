const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const HomeBanner = require("../../../models/homeBannerModel");
const getBaseUrl = require("../../../utils/getBaseUrl");
const imageUpload = require("../../../utils/imageUpload");

const createHomeBanner = async (req, res, next) => {
    // console.log("createHomeBanner -------------------------->", req.body);
    imageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            const { priority } = req.body;
            if (!req.file) throw new ApiError("image is required!", 400);
            let banner_image = getBaseUrl() + "/image/" + req.file.filename;

            const newRecord = await HomeBanner.create({ banner_image, priority });
            res.status(201).json({ status: true, message: "document created successfully", data: newRecord });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = createHomeBanner;