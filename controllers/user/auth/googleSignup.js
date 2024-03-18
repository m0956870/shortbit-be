const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");
const signJWT = require("../../../utils/signJWT");

const googleSignup = async (req, res, next) => {
    // console.log("googleSignup --------------", req.body);
    try {
        const { name, email, profile_image, type, device_token } = req.body;

        if (!name) throw new ApiError("Name is required!", 400);
        if (!email) throw new ApiError("Email is required!", 400);
        if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)) throw new ApiError("Invalid email format!", 400);

        const existingUser = await User.findOne({ email });
        // if (existingUser) throw new ApiError("User already exist!", 400);
        if (existingUser) {
            if (existingUser.is_deleted === true) throw new ApiError("user does not exist!", 403);
            if (existingUser.account_status === "blocked") throw new ApiError("User is blocked!", 403);

            const token = signJWT(existingUser._id);
            existingUser.device_token = device_token;
            existingUser.is_online = true;
            await existingUser.save();

          return  res.status(200).json({ status: true, message: "login successful", data: { token, type: 'login' } });
        }

        const otp = "1234";
        const otp_expiry = new Date(Date.now() + 2 * 60 * 1000);

        await User.create({ name, email, profile_image, otp, otp_expiry, signup_source: type, user_name: Date.now(), user_id: Date.now() });
        res.status(201).json({ status: true, message: "signup successful", data: { type: 'signup'  } });
    } catch (error) {
        next(error);
    }
}

module.exports = googleSignup;