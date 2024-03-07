const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const AppData = require("../../../models/appDataModel");

const getAppData = async (req, res, next) => {
    try {
        let { key } = req.params;
        if (!key) throw new ApiError("key is required", 400)

        let appData = await AppData.findOne({ key })
        if (!appData) throw new ApiError("invalid key", 400)

        res.send(appData.value)
    } catch (error) {
        next(error)
    }
}

module.exports = getAppData;