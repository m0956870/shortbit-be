const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const AppData = require("../../../models/appDataModel");

const createAppData = async (req, res, next) => {
    // console.log("createAppData -------------------------->", req.body);
    try {
        const { key, title, value, test, test2 } = req.body;
        if (!key) throw new ApiError("key is required!", 400);
        if (!title) throw new ApiError("title is required!", 400);
        if (!value) throw new ApiError("value is required!", 400);

        const newRecord = await AppData.create({ key, title, value, test, test2 });
        res.status(201).json({ status: true, message: "document created successfully", data: newRecord });
    } catch (error) {
        next(error);
    }
}

module.exports = createAppData;