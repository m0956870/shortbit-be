const { isValidObjectId } = require("mongoose");
const Agency = require("../../../models/agencyModel");
const getBaseUrl = require("../../../utils/getBaseUrl");
const multipleImageUpload = require("../../../utils/multipleImageUpload");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const updateAgency = async (req, res, next) => {
    // console.log("updateAgency -------------------------->")
    multipleImageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError("Multer error!", 400);

            let { id, name, email, phone_number, status, balance, commission } = req.body;
            if (!id) throw new ApiError("id is required", 400)
            if (!isValidObjectId(id)) throw new ApiError("Invalid ID format", 400);

            let updatedObj = {};
            if (name) updatedObj.name = name;
            if (email) updatedObj.email = email;
            if (phone_number) updatedObj.phone_number = phone_number;
            if (status) updatedObj.status = status;
            if (balance) updatedObj.balance = balance;
            if (commission) updatedObj.commission = commission;
            if (req.files["image"]) updatedObj.profile_image = getBaseUrl() + "/image/" + req.files["image"][0].filename;

            let agency = await Agency.findByIdAndUpdate(id, updatedObj, { new: true }).select("-password -__v");
            res.status(200).json({ status: true, message: "agency updated", data: agency });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = updateAgency;