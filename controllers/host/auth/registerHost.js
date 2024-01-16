const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");
const Agency = require("../../../models/agencyModel");
const Host = require("../../../models/hostModel");

const registerHost = async (req, res, next) => {
    // console.log("registerHost --------------", req.body);
    try {
        const { id, agency_code } = req.body;

        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid id format!", 400);
        if (!agency_code) throw new ApiError("Agency code is required!", 400);

        let agency = await Agency.findOne({ agency_code })
        if (!agency) throw new ApiError('Invalid agency code!', 404);

        let user = await User.findById(id).lean();
        if (user.role === 'user') {
            let updateObj = {};
            updateObj.role = 'host';
            updateObj.account_status = 'unapproved';
            updateObj.agency_code = agency_code;
            const existingUser = await User.findByIdAndUpdate(id, updateObj, { new: true }).lean();
            const newHost = await Host.create(existingUser);
            return res.status(201).json({ status: true, message: "User apllied successfully.", data: existingUser });
        }
        res.status(201).json({ status: true, message: "User already requested!" });

    } catch (error) {
        next(error);
    }
}

module.exports = registerHost;