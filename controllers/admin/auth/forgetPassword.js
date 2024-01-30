const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Admin = require("../../../models/adminModel");

const forgetPassword = async (req, res, next) => {
    // console.log("forgetPassword", req.body);
    try {
        let { email, phone_number } = req.body;
        // if (!email || !phone_number) throw new ApiError("credential is required!", 400);

        let admin = await Admin.findOne({ $or: [{ email }, { phone_number }] });
        if (!admin) throw new ApiError("admin does not found", 404);
        admin.otp = '1234';
        admin.otp_expiry = new Date(Date.now() + 2 * 60 * 1000);
        admin.save();

        res.status(200).json({ status: true, message: "otp sent" });
    } catch (error) {
        next(error);
    }
}

module.exports = forgetPassword;