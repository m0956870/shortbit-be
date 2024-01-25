const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Gift = require("../../../models/giftModel");

const createGift = async (req, res, next) => {
    // console.log("createGift -------------------------->", req.body);
    try {
        const { value, coins, gifts } = req.body;
        if (!value) throw new ApiError("value is required!", 400);
        if (!coins) throw new ApiError("coins is required!", 400);

        const existingRecord = await Gift.findOne({ value }).lean();
        if (existingRecord) throw new ApiError("Gift already exist!", 400);

        const newRecord = await Gift.create({ value, coins, gifts });
        res.status(201).json({ status: true, message: "gift created successfully", data: newRecord });
    } catch (error) {
        next(error);
    }
}

module.exports = createGift;