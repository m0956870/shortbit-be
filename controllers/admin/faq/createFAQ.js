const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const FAQ = require("../../../models/faqModel");

const createFAQ = async (req, res, next) => {
    // console.log("createFAQ -------------------------->", req.body);
    try {
        const { question, answer, priority } = req.body;
        if (!question) throw new ApiError("question is required!", 400);
        if (!answer) throw new ApiError("answer is required!", 400);

        const newRecord = await FAQ.create({ question, answer, priority });
        res.status(201).json({ status: true, message: "document created successfully", data: newRecord });
    } catch (error) {
        next(error);
    }
}

module.exports = createFAQ;