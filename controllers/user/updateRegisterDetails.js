const { ApiError } = require("../../errorHandler/apiErrorHandler");
const imageUpload = require("../../utils/imageUpload");
const getBaseUrl = require("../../utils/getBaseUrl");

const updateRegisterDetails = async (req, res, next) => {
    console.log("updateRegisterDetails -------------------------->", Object.keys(req.body).length)
    imageUpload(req, res, async (error) => {
        try {
            console.log(error)
            if (error) throw new ApiError("Multer error!", 400);

            const user = req.user;
            let { gender, age, interest, location } = req.body;

            if (!location) {
                if (gender) user.gender = gender;
                if (age) user.age = age;
                if (interest) user.interest = JSON.parse(interest);
                if (req.file) user.profile_image = getBaseUrl() + "images/" + req.file.filename;

                await user.save()
                res.status(200).json({ status: true, message: "User details updated successfully!", data: user });
            } else {
                if (location) user.location = JSON.parse(location);
                user.detail_status = 'complete';
                await user.save()
                res.status(200).json({ status: true, message: "User details completed.", data: user });
            }
        } catch (error) {
            next(error);
        }
    })
}

module.exports = updateRegisterDetails;