const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const imageUpload = require("../../../utils/imageUpload");
const getBaseUrl = require("../../../utils/getBaseUrl");

const createPost = async (req, res, next) => {
    // console.log("createPost -------------------------+>", req.user)
    imageUpload(req, res, async (error) => {
        try {
            // if (error) throw new ApiError(error.message, 400);

            // let user = req.user;
            // let { gender, age, interest, location } = req.body;

            // if (!location) {
            //     if (gender) user.gender = gender, user.detail_count = 4;
            //     if (age) user.age = age, user.detail_count = 3;
            //     if (interest) user.interest = JSON.parse(interest), user.detail_count = 2;
            //     if (req.file) user.profile_image = getBaseUrl() + "images/" + req.file.filename, user.detail_count = 1;

            //     await user.save();
            //     res.status(200).json({ status: true, message: "User details updated successfully!", data: user });
            // } else {
            //     if (location) user.location = JSON.parse(location);
            //     user.detail_count = 0;
            //     user.detail_status = 'complete';
            //     await user.save();
            //     res.status(200).json({ status: true, message: "User details completed.", data: user });
            // }
        } catch (error) {
            next(error);
        }
    })
}

module.exports = createPost;