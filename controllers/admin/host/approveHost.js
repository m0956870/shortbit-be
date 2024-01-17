const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Host = require('../../../models/hostModel');
const User = require('../../../models/userModel');

const approveHost = async (req, res, next) => {
    // console.log("approveHost -------------------------->", req.body);
    try {
        let { id } = req.body;
        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

        let updatedObj = {};
        updatedObj.account_status = 'approved';

        const host = await Host.findByIdAndUpdate(id, updatedObj, { new: true }).lean()
        if (!host) throw new ApiError("No host found with this ID", 404);
        const user = await User.findByIdAndUpdate(id, updatedObj, { new: true }).lean()
        if (!user) throw new ApiError("No user found with this ID", 404);

        res.status(200).json({ status: true, message: "host updated sucessfully.", data: host });
    } catch (error) {
        next(error);
    }
}

module.exports = approveHost;