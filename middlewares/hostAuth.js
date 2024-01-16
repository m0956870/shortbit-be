const { ApiError } = require("../errorHandler");
const Host = require("../models/hostModel");
const { verifyJWT } = require("../utils");

const hostAuth = async (req, res, next) => {
    // console.log("hostAuth")
    try {
        const header = req.header("Authorization");
        if (!header) throw new ApiError("No header is present in the request!", 400);
        const token = header.split(" ")[1];
        if (!token || token == "undefined") throw new ApiError("Token is required!", 401);

        const verifiedUser = verifyJWT(token);
        const user = await Host.findById(verifiedUser._id).lean();
        if (!user) throw new ApiError("User not found!", 404);

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = hostAuth;