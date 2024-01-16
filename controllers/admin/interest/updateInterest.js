const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../errorHandler");
const Interest = require("../../../models/interestModel");

const updateInterest = async (req, res, next) => {
    // console.log("updateInterest -------------------------->", req.body);
    try {
        let { id, name, icom } = req.body;
        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

        let updatedVisaObj = {};
        if (name) updatedVisaObj.name = name;
        if (icom) updatedVisaObj.icom = icom;

        let updatedRecord = await Interest.findByIdAndUpdate(id, updatedVisaObj, { new: true }).lean()
        if (!updatedRecord) throw new ApiError("No document found with this ID", 404);
        res.status(200).json({ status: true, message: "interest updated sucessfully.", data: updatedRecord });
    } catch (error) {
        next(error);
    }
}

module.exports = updateInterest;