const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Agency = require("../../../models/agencyModel");

const forgetPassword = async (req, res, next) => {
    // console.log("forgetPassword", req.body);
    try {
        let { email, phone_number } = req.body;
        if (!email && !phone_number) throw new ApiError("credential is required!", 400);

        let findVal = email ? { email } : { phone_number }
        let agency = await Agency.findOne(findVal);
        // let agency = await Agency.findOne({ $or: [{ email }, { phone_number }] });
        if (!agency) throw new ApiError("agency does not found", 404);
        // agency.otp = '1234';
        // agency.otp_expiry = new Date(Date.now() + 2 * 60 * 1000);
        // agency.save();

        await Agency.findByIdAndUpdate(agency._id, { otp: '1234', otp_expiry: new Date(Date.now() + 10 * 60 * 1000) })

        res.status(200).json({ status: true, message: "otp sent" });
    } catch (error) {
        next(error);
    }
}

module.exports = forgetPassword;