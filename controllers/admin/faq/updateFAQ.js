const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const FAQ = require("../../../models/faqModel");

const updateFAQ = async (req, res, next) => {
    // console.log("updateFAQ -------------------------->", req.body);
    try {
        let { id, question, answer, priority } = req.body;
        if (!id) throw new ApiError("ID is required!", 400);
        if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

        let updatedObj = {};
        if (question) updatedObj.question = question;
        if (answer) updatedObj.answer = answer;
        if (priority) updatedObj.priority = priority;

        let updatedRecord = await FAQ.findByIdAndUpdate(id, updatedObj, { new: true }).lean();
        if (!updatedRecord) throw new ApiError("No document found with this ID", 404);
        res.status(200).json({ status: true, message: "document updated sucessfully.", data: updatedRecord });
    } catch (error) {
        next(error);
    }
}

module.exports = updateFAQ;