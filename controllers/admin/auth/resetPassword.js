const bcrypt = require("bcrypt");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Admin = require("../../../models/adminModel");

const resetPassword = async (req, res, next) => {
    console.log("resetPassword admin")
    try {
        const { email, phone_number, otp, password } = req.body;
        if (!otp) throw new ApiError("otp is required!", 400);
        if (!password) throw new ApiError("Password is required!", 400);

        const admin = await Admin.findOne({ $or: [{ email }, { phone_number }] });
        if (!admin) throw new ApiError("admin not found", 400);

        if (new Date(admin.otp_expiry) < new Date()) throw new ApiError("otp expired", 400);
        if (admin.otp !== otp) throw new ApiError("incorrect otp", 400);

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        await Admin.findByIdAndUpdate(admin._id, { password: hashPass }, { new: true })
        res.status(200).json({ status: true, message: "Password reseted successfully." });
    } catch (error) {
        next(error)
    }
}

module.exports = resetPassword;