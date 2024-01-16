const bcrypt = require("bcrypt");
const signJWT = require("../../../utils/signJWT");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Admin = require("../../../models/adminModel");

const loginAdmin = async ({ body }, res, next) => {
    console.log("loginAdmin --------------------->", body);
    try {
        const { email, password } = body;
        if (!email) throw new ApiError("Email is required!", 400);
        if (!password) throw new ApiError("Password is required!", 400);

        const admin = await Admin.findOne({ email }).lean();
        if (!admin) throw new ApiError("User does not exist!", 404);

        const passMatched = await bcrypt.compare(password, admin.password);
        if (!passMatched || email !== admin.email) throw new ApiError("Invalid credentails!", 404);

        const token = signJWT(admin._id);

        res.status(200).json({ status: true, message: "Login successful.", data: { admin, token } });
    } catch (error) {
        next(error);
    }
}

module.exports = loginAdmin;