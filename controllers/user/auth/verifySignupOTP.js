const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");
const signJWT = require("../../../utils/signJWT");

const verifySignupOTP = async (req, res, next) => {
    // console.log("verifySignupOTP --------------", req.body);
    try {
        const { phone_number, otp } = req.body;

        if (!phone_number) throw new ApiError("Phone Number is required!", 400);
        if (isNaN(phone_number)) throw new ApiError("Phone Number is invalid!", 400);
        if (!otp) throw new ApiError("OTP is required!", 400);

        const user = await User.findOne({ phone_number, signup_otp: otp }).select("role").lean();
        if (!user) throw new ApiError("Incorrect OTP!", 400);

        const token = signJWT(user._id);
        res.status(201).json({ status: true, message: "User signed up successfully.", data: { token } });
    } catch (error) {
        next(error);
    }
}

module.exports = verifySignupOTP;