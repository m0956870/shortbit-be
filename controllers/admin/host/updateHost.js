const User = require('../../../models/userModel');
const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const getBaseUrl = require("../../../utils/getBaseUrl");
const multipleImageUpload = require("../../../utils/multipleImageUpload");

const accountStatus = ['active', 'inactive', 'blocked', 'unapproved', 'approved'];

const updateHost = async (req, res, next) => {
    // console.log("updateHost -------------------------->", req.body);
    multipleImageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);
            let { id, name, email, phone_number, gender, dob, interest, height, language, avtar, location, about_me, level, is_live_busy, is_voice_busy, is_video_busy, status, commission, price_per_min } = req.body;
            if (!id) throw new ApiError("ID is required!", 400);
            if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);
            if (status) if (!accountStatus.includes(status)) throw new ApiError("Invalid status!", 400);

            const user = await User.findById(id);
            if (!user) throw new ApiError("No user found with this ID", 404);
            if (user.role === 'user') throw new ApiError("user is not a host", 404);

            if (name) user.name = name;
            if (email) user.email = email;
            if (phone_number) user.phone_number = phone_number;
            if (gender) user.gender = gender;
            if (dob) user.dob = dob;
            if (interest) user.interest = JSON.parse(interest);
            if (height) user.height = height;
            if (language) user.language = language;
            if (avtar) user.avtar = avtar;
            if (location) user.location = JSON.parse(location);
            if (about_me) user.about_me = about_me;
            if (level) user.level = level;
            if (is_live_busy && String(is_live_busy)) user.is_live_busy = !is_live_busy;
            if (is_voice_busy && String(is_voice_busy)) user.is_voice_busy = !is_voice_busy;
            if (is_video_busy && String(is_video_busy)) user.is_video_busy = !is_video_busy;

            if (commission) user.commission = commission;
            if (price_per_min) user.price_per_min = price_per_min;
            if (status) user.account_status = status;
            if (req.files['image']) user.profile_image = getBaseUrl() + "/image/" + req.files['image'][0].filename;
            await user.save();

            // const user = await User.findByIdAndUpdate(id, updatedObj, { new: true }).lean()
            res.status(200).json({ status: true, message: "host updated sucessfully.", data: user });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = updateHost;