const { ApiError } = require("../../errorHandler/apiErrorHandler.js");
const userSchema = require("../../models/userModel.js");
const avtarSchema = require("../../models/avatarModel.js");
const multipleImageUpload = require("../../utils/multipleImageUpload.js");
const getBaseUrl = require("../../utils/getBaseUrl.js");

const updateDetails = async (req, res, next) => {
    multipleImageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);
            const body = {
                name: req.body.name,
                gender: req.body.gender,
                dob: req.body.dob,
                user_name: req.body.user_name,
                about_me: req.body.about_me,
                account_status: req.body.account_status,
                service_status: req.body.service_status,
            };
            if (body.user_name) {
                const alreadyUserName = await userSchema.findOne({ user_name: body.user_name });
                if (alreadyUserName) throw new ApiError(`UserName  ${body.user_name} already exists`);
            }
            const condition = {};
            for (let key in body) {
                if (body[key] != undefined && body[key] != "") {
                    condition[key] = body[key];
                }
            }

            if (req.body.avtar) condition.avtar = req.body.avtar;
            if (req.files?.["image"]?.[0]) condition.profile_image = getBaseUrl() + "/image/" + req.files["image"][0].filename;

            if (body.dob) {
                // calculate age
                let year = body.dob.split("/")[2];
                let age = new Date().getFullYear() - year;
                condition.age = age;
            }

            const result = await userSchema.findByIdAndUpdate(req.user.id, condition, { new: true })
            res.status(200).json({ status: true, message: "updateDetails.", result });
        } catch (error) {
            next(error);
        }
    })
};

module.exports = updateDetails;
