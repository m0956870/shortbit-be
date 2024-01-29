const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Avatar = require("../../../models/avatarModel");
const imageUpload = require("../../../utils/imageUpload");
const getBaseUrl = require("../../../utils/getBaseUrl");

const updateAvatar = async (req, res, next) => {
    // console.log("updateAvatar -------------------------->", req.body);
    imageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            let { id, name, icon } = req.body;
            if (!id) throw new ApiError("ID is required!", 400);
            if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

            let updatedObj = {};
            if (name) updatedObj.name = name;
            if (req.file) updatedObj.icon = getBaseUrl() + "/image/" + req.file.filename;

            let updatedRecord = await Avatar.findByIdAndUpdate(id, updatedObj, { new: true }).lean()
            if (!updatedRecord) throw new ApiError("No document found with this ID", 404);
            res.status(200).json({ status: true, message: "avatar updated sucessfully.", data: updatedRecord });
        } catch (error) {
            next(error);
        }
    });
}

module.exports = updateAvatar;