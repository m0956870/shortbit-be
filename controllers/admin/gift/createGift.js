const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Gift = require("../../../models/giftModel");
const getBaseUrl = require("../../../utils/getBaseUrl");
const imageUpload = require("../../../utils/imageUpload");

const createGift = async (req, res, next) => {
    // console.log("createGift -------------------------->", req.body);
    imageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            const { name, value, coins } = req.body;
            if (!name) throw new ApiError("name is required!", 400);
            if (!value) throw new ApiError("value is required!", 400);
            if (!coins) throw new ApiError("coins is required!", 400);

            let icon;
            if (req.file) icon = getBaseUrl() + "/image/" + req.file.filename;

            const existingRecord = await Gift.findOne({ value }).lean();
            if (existingRecord) throw new ApiError("Gift already exist!", 400);

            const newRecord = await Gift.create({ name, icon, value, coins });
            res.status(201).json({ status: true, message: "gift created successfully", data: newRecord });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = createGift;