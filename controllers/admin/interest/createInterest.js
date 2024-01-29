const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Interest = require("../../../models/interestModel");
const getBaseUrl = require("../../../utils/getBaseUrl");
const imageUpload = require("../../../utils/imageUpload");

const createInterest = async (req, res, next) => {
    // console.log("createInterest -------------------------->", req.body);
    imageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            const { name } = req.body;
            if (!name) throw new ApiError("name is required!", 400);

            const existingRecord = await Interest.findOne({ name }).lean()
            if (existingRecord) throw new ApiError("interest already exist!", 400);

            let icon;
            if (req.file) icon = getBaseUrl() + "/image/" + req.file.filename;

            const newRecord = await Interest.create({ name, icon });
            res.status(201).json({ status: true, message: "interest created successfully.", data: newRecord });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = createInterest;