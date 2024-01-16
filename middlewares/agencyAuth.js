const { ApiError } = require("../errorHandler");
const Agency = require("../models/agencyModel");
const { verifyJWT } = require("../utils");

const userAuth = async (req, res, next) => {
    // console.log("userAuth")
    try {
        const header = req.header("Authorization");
        if (!header) throw new ApiError("No header is present in the request!", 400);
        const token = header.split(" ")[1];
        if (!token || token == "undefined") throw new ApiError("Token is required!", 401);

        const verifiedUser = verifyJWT(token);
        const user = await Agency.findById(verifiedUser._id).lean();
        if (!user) throw new ApiError("User not found!", 404);

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = userAuth;