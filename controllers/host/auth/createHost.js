const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");
const Agency = require("../../../models/agencyModel");

const createHost = async (req, res, next) => {
    // console.log("createHost --------------", req.body);
    try {
        const { id, agency_code } = req.body;

        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid id format!", 400);
        if (!agency_code) throw new ApiError("Agency code is required!", 400);

        let agency = await Agency.findOne({ agency_code })
        if (!agency) throw new ApiError('no agency found with this code', 404);

        const existingUser = await User.findByIdAndUpdate(id, { role: 'host', account_status: 'unapproved' }, { new: true }).lean();
        res.status(201).json({ status: true, message: "User apllied successfully.", data: existingUser });
    } catch (error) {
        next(error);
    }
}

module.exports = createHost;