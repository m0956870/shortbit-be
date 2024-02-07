const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Settlement = require('../../../models/settlementModel');

const settlementStatus = ['pending', 'settled'];

const updateSettlement = async (req, res, next) => {
    // console.log("updateSettlement -------------------------->", req.body);
    try {
        let { id, status } = req.body;
        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid ID format!", 400);
        if (!settlementStatus.includes(status)) throw new ApiError("Invalid status!", 400);

        let updatedObj = {};
        updatedObj.status = status;

        const settlement = await Settlement.findByIdAndUpdate(id, updatedObj, { new: true }).lean();
        if (!settlement) throw new ApiError("No settlement found with this ID", 404);

        res.status(200).json({ status: true, message: "settlement updated", data: settlement });
    } catch (error) {
        next(error);
    }
}

module.exports = updateSettlement;