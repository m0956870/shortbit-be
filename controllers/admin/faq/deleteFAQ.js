const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const FAQ = require("../../../models/faqModel");

const deleteFAQ = async (req, res, next) => {
    // console.log("deleteFAQ -------------------------->", req.params)
    try {
        const deletedData = await FAQ.findByIdAndDelete(req.params.id).lean();
        if (!deletedData) throw new ApiError('no record found with this id', 400)
        res.status(200).json({ status: true, message: "document deleted successfully.", });
    } catch (error) {
        next(error);
    }
}

module.exports = deleteFAQ;