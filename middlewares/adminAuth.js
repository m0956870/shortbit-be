const { ApiError } = require("../errorHandler/apiErrorHandler");
const verifyJWT = require('../utils/verifyJWT')
const Admin = require("../models/adminModel");

const adminAuth = async (req, res, next) => {
    // console.log("adminAuth")
    try {
        const header = req.header("Authorization");
        if (!header) throw new ApiError("No header is present in the request!", 400);
        const token = header.split(" ")[1];
        if (!token || token == "undefined") throw new ApiError("Token is required!", 401);

        const verifiedUser = verifyJWT(token);
        const user = await Admin.findById(verifiedUser._id);
        if (!user) throw new ApiError("User not found!", 404);

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = adminAuth;