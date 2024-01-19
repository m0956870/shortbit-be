const bcrypt = require("bcrypt");
const User = require("../../../models/userModel");
const signJWT = require("../../../utils/signJWT");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const loginUser = async (req, res, next) => {
    // console.log("loginUser", req.body);
    try {
        const { email, password } = req.body;
        if (!email) throw new ApiError("Email is required!", 400);
        if (!password) throw new ApiError("Password is required!", 400);

        let user = await User.findOne({ email }).lean();
        if (!user) throw new ApiError("User does not exist!", 404);

        const passMatched = await bcrypt.compare(password, user.password);
        if (!passMatched || email !== user.email) throw new ApiError("Invalid credentails!", 404);

        const token = signJWT(user._id);
        res.status(200).json({ status: true, message: "Login successful.", data: { token } });
    } catch (error) {
        next(error);
    }
}

module.exports = loginUser;