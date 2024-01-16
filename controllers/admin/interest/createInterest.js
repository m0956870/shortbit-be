const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Interest = require("../../../models/interestModel");

const createInterest = async (req, res, next) => {
    // console.log("createInterest -------------------------->", req.body);
    try {
        const { name, icon } = req.body;
        if (!name) throw new ApiError("name is required!", 400);

        const existingRecord = await Interest.findOne({ name }).lean()
        if (existingRecord) throw new ApiError("interest already exist!", 400);

        const newRecord = await Interest.create({ name, icon });
        res.status(201).json({ status: true, message: "interest created successfully.", data: newRecord });
    } catch (error) {
        next(error);
    }
}

module.exports = createInterest;