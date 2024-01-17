const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Admin = require("../../../models/adminModel");

const signupAdmin = async (req, res, next) => {
    // console.log("signupAdmin --------------", req.body);
    try {
        const { email, password, role } = req.body;

        if (!email) throw new ApiError("Email is required!", 400);
        if (!password) throw new ApiError("Password is required!", 400);

        const existingUser = await Admin.findOne({ email }).lean();
        if (existingUser) throw new ApiError("Admin already exist!", 400);

        const newUser = await Admin.create({ email, password, role });
        res.status(201).json({ status: true, message: "Admin signup successfully.", data: newUser });
    } catch (error) {
        next(error);
    }
}

module.exports = signupAdmin;