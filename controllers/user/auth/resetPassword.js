const bcrypt = require("bcrypt");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");

const resetPassword = async (req, res, next) => {
    // console.log("resetPassword")
    try {
        const { email, phone_number, otp, password } = req.body;
        if (!otp) throw new ApiError("otp is required!", 400);
        if (!password) throw new ApiError("Password is required!", 400);

        const user = await User.findOne({ $or: [{ email }, { phone_number }] });
        if (new Date(user.otp_expiry) < new Date()) throw new ApiError("otp expired", 400);
        if (user.otp !== otp) throw new ApiError("incorrect otp", 400);

        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password, salt);

        user.password = hashPass;
        user.save()
        res.status(200).json({ status: true, message: "Password reseted successfully.", });
    } catch (error) {
        next(error)
    }
}

module.exports = resetPassword;