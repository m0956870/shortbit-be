const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");

const forgetPassword = async (req, res, next) => {
    // console.log("forgetPassword", req.body);
    try {
        let { email, phone_number } = req.body;
        // if (!email || !phone_number) throw new ApiError("credential is required!", 400);

        let user = await User.findOne({ $or: [{ email }, { phone_number }] });
        if (!user) throw new ApiError("user does not found", 404);
        user.otp = '1234';
        user.otp_expiry = new Date(Date.now() + 2 * 60 * 1000);
        user.save();

        res.status(200).json({ status: true, message: "otp sent" });
    } catch (error) {
        next(error);
    }
}

module.exports = forgetPassword;