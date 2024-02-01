const FAQ = require("../../../models/faqModel");

const getAllFAQ = async (req, res, next) => {
    // console.log("getAllFAQ -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

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

module.exports = getAllFAQ;