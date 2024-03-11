const { ApiError } = require("../errorHandler/apiErrorHandler");
const User = require("../models/userModel");
const verifyJWT = require("../utils/verifyJWT");

const userAuth = async (req, res, next) => {
    try {
        const header = req.header("Authorization");
        if (!header) throw new ApiError("No header is present in the request!", 400);
        const token = header.split(" ")[1];
        if (!token || token == "undefined") throw new ApiError("Token is required!", 401);

        const verifiedUser = verifyJWT(token);
        const user = await User.findById(verifiedUser._id);
        if (!user) throw new ApiError("User not found!", 404);
        if (user.is_deleted === true) throw new ApiError("user does not exist", 404);

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = userAuth;