const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Interest = require("../../../models/interestModel");

const deleteInterest = async (req, res, next) => {
    // console.log("deleteInterest -------------------------->")
    try {
        const deletedData = await Interest.findByIdAndDelete(req.params.id).lean()
        if(!deletedData) return new ApiError('no interest found with this id', 400)
        res.status(200).json({ status: true, message: "interest deleted successfully.", data: deletedData, });
    } catch (error) {
        next(error);
    }
}

module.exports = deleteInterest;