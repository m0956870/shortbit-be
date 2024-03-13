const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");

const googleSignup = async (req, res, next) => {
    // console.log("googleSignup --------------", req.body);
    try {
        const { name, email, profile_image, type } = req.body;

        if (!name) throw new ApiError("Name is required!", 400);
        if (!email) throw new ApiError("Email is required!", 400);
        if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)) throw new ApiError("Invalid email format!", 400);

        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) throw new ApiError("User already exist!", 400);

        const otp = "1234";
        const otp_expiry = new Date(Date.now() + 2 * 60 * 1000);

        await User.create({ name, email, profile_image, otp, otp_expiry, signup_source: type, user_name: Date.now(), user_id: Date.now() });
        res.status(201).json({ status: true, message: "User created successfully.", data: { otpExpiry: otp_expiry, } });
    } catch (error) {
        next(error);
    }
}

module.exports = googleSignup;