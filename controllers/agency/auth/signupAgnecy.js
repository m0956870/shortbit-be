const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Agency = require("../../../models/agencyModel");

const signupAgnecy = async (req, res, next) => {
    // console.log("signupAgnecy ----------", req.body);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = String(today.getFullYear());

    try {
        const { name, email, password, phone_number } = req.body;

        if (!email) throw new ApiError("Email is required!", 400);
        if (!password) throw new ApiError("Password is required!", 400);
        if (!phone_number) throw new ApiError("Phone Number is required!", 400);
        if (isNaN(phone_number)) throw new ApiError("Phone Number is invalid!", 400);

        const existingUser = await Agency.findOne({ email }).lean();
        if (existingUser) throw new ApiError("Agency already exist!", 400);
        
        let asc = `${name.toString().toLowerCase().slice(0, 4)}${dd}${yyyy.slice(2)}`;
        let count = await Agency.countDocuments()
        let agency_code = `${asc}${count + 1}`;

        const newUser = await Agency.create({ name, email, password, phone_number, agency_code });
        res.status(201).json({ status: true, message: "Agency signup successfully.", data: newUser });
    } catch (error) {
        console.log("error ---------------", error)
        next(error);
    }
}

module.exports = signupAgnecy;