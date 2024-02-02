const FAQ = require("../../../models/faqModel");

const getAllFAQs = async (req, res, next) => {
    // console.log("getAllFAQs -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page && page;
        limit = limit && limit;

        const findConditions = { status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const totalData = await FAQ.countDocuments(findConditions);
        const allData = await FAQ.find(findConditions).lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ priority: 1 })
            .select(" -__v")

        res.status(200).json({
            status: true,
            message: "faq listing",
            total_data: totalData,
            total_pages: Math.ceil(totalData / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllFAQs;