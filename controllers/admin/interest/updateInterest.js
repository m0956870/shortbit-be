const { isValidObjectId } = require("mongoose");
const Interest = require("../../../models/interestModel");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const imageUpload = require("../../../utils/imageUpload");
const getBaseUrl = require("../../../utils/getBaseUrl");

const updateInterest = async (req, res, next) => {
    // console.log("updateInterest -------------------------->", req.body);
    imageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);
            let { id, name, icon } = req.body;
            if (!id) throw new ApiError("ID is required!", 400);
            if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

            let updatedObj = {};
            if (name) updatedObj.name = name;
            if (req.file) updatedObj.icon = getBaseUrl() + "/image/" + req.file.filename;

            let updatedRecord = await Interest.findByIdAndUpdate(id, updatedObj, { new: true }).lean()
            if (!updatedRecord) throw new ApiError("No document found with this ID", 404);
            res.status(200).json({ status: true, message: "interest updated sucessfully.", data: updatedRecord });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = updateInterest;