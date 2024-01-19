const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../errorHandler/apiErrorHandler");
const User = require("../../models/userModel");
const Agency = require("../../models/agencyModel");

const hostRequest = async (req, res, next) => {
    // console.log("hostRequest --------------", req.body);
    try {
        const { id, agency_code } = req.body;

        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid id format!", 400);
        if (!agency_code) throw new ApiError("Agency code is required!", 400);

        let agency = await Agency.findOne({ agency_code })
        if (!agency) throw new ApiError('Invalid agency code!', 404);

        let user = await User.findById(id)
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