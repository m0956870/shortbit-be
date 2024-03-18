const bcrypt = require("bcrypt");
const User = require("../../../models/userModel");
const signJWT = require("../../../utils/signJWT");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const googleLogin = async (req, res, next) => {
    // console.log("googleLogin", req.body);
    try {
        res.send("depricated");
        // const { email, device_token } = req.body;
        // if (!email) throw new ApiError("credential is required!", 400);

        // let user = await User.findOne({ email });
        // // let user = await User.findOne(findVal);

        // if (!user) throw new ApiError("User does not exist!", 404);
        // if (user.is_deleted === true) throw new ApiError("user does not exist!", 403);
        // if (user.account_status === "blocked") throw new ApiError("User is blocked!", 403);

        // const token = signJWT(user._id);
        // user.device_token = device_token;
        // user.is_online = true;
        // await user.save();

        // res.status(200).json({ status: true, message: "login successful", data: { token } });
    } catch (error) {
        next(error);
    }
}

module.exports = googleLogin;