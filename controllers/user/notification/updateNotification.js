const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Notification = require("../../../models/notificationModel");

const updateNotification = async (req, res, next) => {
    // console.log("updateNotification", req.body)
    try {
        let { id, type } = req.body
        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

        // let updatedObj = {};
        // updatedObj.status = false;
        // let updatedRecord = await Notification.findByIdAndUpdate(id, updatedObj, { new: true }).lean();
       
        let deletedRecord = await Notification.findByIdAndDelete(id).lean();
        if (!deletedRecord) throw new ApiError("No document found with this ID", 404);
        res.status(200).json({ status: true, message: "notification deleted", data: deletedRecord });
    } catch (error) {
        next(error);
    }
}

module.exports = updateNotification;