const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");
const signJWT = require("../../../utils/signJWT");

const verifySignupOTP = async (req, res, next) => {
    console.log("verifySignupOTP --------------", req.body);
    try {
        const { email, phone_number, otp } = req.body;

        if (!email && !phone_number) throw new ApiError("credential is required!", 400);
        // if (!phone_number) throw new ApiError("Phone Number is required!", 400);
        // if (isNaN(phone_number)) throw new ApiError("Phone Number is invalid!", 400);
        if (!otp) throw new ApiError("OTP is required!", 400);
        // 
        // const user = await User.findOne({ phone_number, otp }).select("role").lean();
        const user = await User.findOne({ $or: [{ email }, { phone_number }] });
        if (!user) throw new ApiError("no user found!", 400);
        if (user.is_deleted === true) throw new ApiError("user does not exist", 404);
        if (new Date(user.otp_expiry) < new Date()) throw new ApiError("otp expired", 400);
        if (user.otp !== String(otp)) throw new ApiError("Incorrect OTP!", 400);

        const token = signJWT(user._id);
        res.status(200).json({ status: true, message: "User signed in successful", data: { token } });
    } catch (error) {
        next(error);
    }
}

module.exports = verifySignupOTP;