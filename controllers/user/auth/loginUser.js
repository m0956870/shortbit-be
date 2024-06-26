const bcrypt = require("bcrypt");
const User = require("../../../models/userModel");
const signJWT = require("../../../utils/signJWT");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const loginUser = async (req, res, next) => {
    // console.log("loginUser", req.body);
    try {
        const { email, phone_number, password, device_token } = req.body;
        if (!email && !phone_number) throw new ApiError("credential is required!", 400);
        if (!password) throw new ApiError("Password is required!", 400);

        let findVal = email ? { email } : { phone_number }
        // let user = await User.findOne({ $or: [{ email }, { phone_number }] });
        let user = await User.findOne(findVal);

        if (!user) throw new ApiError("User does not exist!", 404);
        if (user.is_deleted === true) throw new ApiError("user does not exist!", 403);
        if (user.account_status === "blocked") throw new ApiError("User is blocked!", 403);

        const passMatched = await bcrypt.compare(password, user.password);
        if (!passMatched || email !== user.email) throw new ApiError("Invalid credentails!", 404);

        const token = signJWT(user._id);
        user.device_token = device_token;
        user.is_online = true;
        user.save();

        res.status(200).json({ status: true, message: "login successful", data: { token } });
    } catch (error) {
        next(error);
    }
}

module.exports = loginUser;