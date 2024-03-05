const User = require("../../../models/userModel");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const logoutUser = async (req, res, next) => {
    // console.log("logoutUser", req.body);
    try {
        let rootUser = req.user;

        rootUser.is_online = false;
        rootUser.save()

        res.status(200).json({ status: true, message: "logout successful" });
    } catch (error) {
        next(error);
    }
}

module.exports = logoutUser;