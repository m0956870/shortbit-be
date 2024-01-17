const bcrypt = require("bcrypt");
const signJWT = require("../../../utils/signJWT");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Agency = require("../../../models/agencyModel");

const loginAgency = async ({ body }, res, next) => {
    // console.log("loginAgency --------------------->", body);
    try {
        const { email, password } = body;
        if (!email) throw new ApiError("Email is required!", 400);
        if (!password) throw new ApiError("Password is required!", 400);

        const agency = await Agency.findOne({ email }).lean();
        if (!agency) throw new ApiError("Agency does not exist!", 404);

        const passMatched = await bcrypt.compare(password, agency.password);
        if (!passMatched || email !== agency.email) throw new ApiError("Invalid credentails!", 404);

        const token = signJWT(agency._id);
        res.status(200).json({ status: true, message: "Login successful.", data: { agency, token } });
    } catch (error) {
        next(error);
    }
}

module.exports = loginAgency;