const User = require("../../../models/userModel");
const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const getBaseUrl = require("../../../utils/getBaseUrl");
const multipleImageUpload = require("../../../utils/multipleImageUpload");


const updateUser = async (req, res, next) => {
    // console.log("updateUser -------------------------+>", req.user)
    multipleImageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            let { id, status } = req.body;
            if (!id) throw new ApiError("id is required", 400);
            if (!isValidObjectId(id)) throw new ApiError("Invalid ID format", 400);

            let updatedObj = {};
            if (status) updatedObj.account_status = status;
            if (req.file) updatedObj.profile_image = getBaseUrl() + "/image/" + req.files['image'][0].filename;

            let user = await User.findByIdAndUpdate(id, updatedObj, { new: true });
            if (!user) throw new ApiError("user not found with this id", 400);
            if (user.is_deleted === true) throw new ApiError("user does not exist", 404);

            res.status(200).json({ status: true, message: "User details updated successfully!", data: user });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = updateUser;