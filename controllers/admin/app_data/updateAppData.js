const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const AppData = require("../../../models/appDataModel");

const updateAppData = async (req, res, next) => {
    // console.log("updateAppData -------------------------->", req.body);
    try {
        let { id, title, value, status } = req.body;
        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

        let updatedObj = {};
        if (title) updatedObj.title = title;
        if (value) updatedObj.value = value;
        if (status) updatedObj.status = status;

        let updatedRecord = await AppData.findByIdAndUpdate(id, updatedObj, { new: true }).lean();
        if (!updatedRecord) throw new ApiError("No document found with this ID", 404);
        res.status(200).json({ status: true, message: "document updated sucessfully.", data: updatedRecord });
    } catch (error) {
        next(error);
    }
}

module.exports = updateAppData;