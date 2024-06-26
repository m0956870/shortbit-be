const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");
const Agency = require("../../../models/agencyModel");

const hostRequest = async (req, res, next) => {
    // console.log("hostRequest --------------", req.body);
    try {
        const { agency_code } = req.body;
        if (!agency_code) throw new ApiError("Agency code is required!", 400);

        let agency = await Agency.findOne({ agency_code })
        if (!agency) throw new ApiError('Invalid agency code!', 404);

        let user = await User.findById(req.user._id)
        if (user.is_deleted === true) throw new ApiError("user does not exist", 404);
        if (user.role === 'user') {
            user.role = 'host';
            user.account_status = 'unapproved';
            user.agency_code = agency_code;
            await user.save();
            return res.status(201).json({ status: true, message: "User requested successfully.", data: user });
        }
        res.status(201).json({ status: true, message: "User already requested!" });

    } catch (error) {
        next(error);
    }
}

module.exports = hostRequest;