const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Avatar = require("../../../models/avatarModel");
const getBaseUrl = require("../../../utils/getBaseUrl");
const imageUpload = require("../../../utils/imageUpload");

const createAvatar = async (req, res, next) => {
    // console.log("createAvatar -------------------------->", req.body);
    imageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            const { name } = req.body;
            if (!name) throw new ApiError("name is required!", 400);
            if (!req.file) throw new ApiError("icon is required!", 400);

            let icon = getBaseUrl() + "/image/" + req.file.filename;

            const existingRecord = await Avatar.findOne({ name }).lean();
            if (existingRecord) throw new ApiError("avatar already exist!", 400);

            const newRecord = await Avatar.create({ name, icon });
            res.status(201).json({ status: true, message: "avatar created successfully.", data: newRecord });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = createAvatar;