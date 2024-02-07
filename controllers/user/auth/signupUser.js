const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");

const signupUser = async (req, res, next) => {
    // console.log("signupUser --------------", req.body);
    try {
        const { name, email, password, phone_number } = req.body;

        if (!name) throw new ApiError("Name is required!", 400);
        if (!email) throw new ApiError("Email is required!", 400);
        if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)) throw new ApiError("Invalid email format!", 400);
        if (!phone_number) throw new ApiError("Phone Number is required!", 400);
        if (isNaN(phone_number)) throw new ApiError("Phone Number is invalid!", 400);
        if (!password) throw new ApiError("Password is required!", 400);
        if (password.length < 6) throw new ApiError("Password should be bigger than 6 digits!", 400);

        const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] }).lean();
        if (existingUser) throw new ApiError("User already exist!", 400);

        const otp = "1234";
        const otp_expiry = new Date(Date.now() + 2 * 60 * 1000);

        await User.create({ name, email, password, phone_number, otp, otp_expiry, user_name: Date.now() });
        res.status(201).json({ status: true, message: "User created successfully.", data: { phone: phone_number, otpExpiry: otp_expiry, } });
    } catch (error) {
        next(error);
    }
}

module.exports = signupUser;