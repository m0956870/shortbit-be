const { ApiError } = require("../../errorHandler/apiErrorHandler");
const imageUpload = require("../../utils/imageUpload");
const getBaseUrl = require("../../utils/getBaseUrl");

const updateRegisterDetails = async (req, res, next) => {
    // console.log("updateRegisterDetails -------------------------+>", req.user)
    imageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);
        
            let user = req.user;
            let { gender, dob, interest, location } = req.body;
            
            if (!location) {
                if (gender) user.gender = gender, user.detail_count = 1;
                if (dob) user.dob = dob, user.detail_count = 1;
                if (interest) user.interest = JSON.parse(interest), user.detail_count = 2;
                if (req.file) user.profile_image = getBaseUrl() + "/image/" + req.file.filename, user.detail_count = 3;
                
                await user.save();
                res.status(200).json({ status: true, message: "User details updated successfully!", data: user });
            } else {
                if (location) user.location = JSON.parse(location);
                user.detail_count = 4;
                user.detail_status = 'complete';
                
                await user.save();
                res.status(200).json({ status: true, message: "User details completed.", data: user });
            }
        } catch (error) {
            next(error);
        }
    })
}

module.exports = updateRegisterDetails;