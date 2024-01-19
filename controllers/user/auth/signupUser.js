const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");

const signupUser = async (req, res, next) => {
    // console.log("signupUser --------------", req.body);
    try {
        const { name, email, password, phone_number } = req.body;

        if (!name) throw new ApiError("Name is required!", 400);
        if (!email) throw new ApiError("Email is required!", 400);
        if (!phone_number) throw new ApiError("Phone Number is required!", 400);
        if (isNaN(phone_number)) throw new ApiError("Phone Number is invalid!", 400);
        if (!password) throw new ApiError("Password is required!", 400);

        const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] }).lean();
        if (existingUser) throw new ApiError("User already exist!", 400);

        const signup_otp = "1234";
        const signup_otp_expiry = new Date(Date.now() + 2 * 60 * 1000);

        await User.create({ name, email, password, phone_number, signup_otp, signup_otp_expiry });
        res.status(201).json({ status: true, message: "User created successfully.", data: { phone: phone_number, otpExpiry: signup_otp_expiry, } });
    } catch (error) {
        next(error);
    }
}

module.exports = signupUser;