const User = require('../../../models/userModel');
const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const getBaseUrl = require("../../../utils/getBaseUrl");
const multipleImageUpload = require("../../../utils/multipleImageUpload");

const accountStatus = ['active', 'inactive', 'blocked', 'unapproved', 'approved'];

const updateHost = async (req, res, next) => {
    // console.log("updateHost -------------------------->", req.body);
    multipleImageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);
            let { id, status } = req.body;
            if (!id) throw new ApiError("ID is required!", 400);
            if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);
            if (!accountStatus.includes(status)) throw new ApiError("Invalid status!", 400);

            let updatedObj = {};
            updatedObj.account_status = status;
            if (req.file) updatedObj.profile_image = getBaseUrl() + "/image/" + req.files['image'][0].filename;

            const user = await User.findByIdAndUpdate(id, updatedObj, { new: true }).lean()
            if (!user) throw new ApiError("No user found with this ID", 404);

            res.status(200).json({ status: true, message: "host updated sucessfully.", data: user });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = updateHost;