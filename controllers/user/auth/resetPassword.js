const bcrypt = require("bcrypt");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const User = require("../../../models/userModel");

const resetPassword = async (req, res, next) => {
    // console.log("resetPassword")
    try {
        const { email, phone_number, password } = req.body;
        if (!password) throw new ApiError("Password is required!", 400);

        const user = await User.findOne({ $or: [{ email }, { phone_number }] });
        if(!user) throw new ApiError("user not found!", 400);
        if (user.is_deleted === true) throw new ApiError("user does not exist", 404);

        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(user._id, { password: hashPass }, { new: true })
        res.status(200).json({ status: true, message: "Password reseted successfully.", });
    } catch (error) {
        next(error)
    }
}

module.exports = resetPassword;