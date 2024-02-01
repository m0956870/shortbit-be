const { ApiError } = require("../../../errorHandler/apiErrorHandler");

const deleteAudio = async (req, res, next) => {
    // console.log("deleteAudio -------------------------->", req.params)
    try {
        const deletedData = await Audio.findByIdAndDelete(req.params.id).lean();
        if (!deletedData) throw new ApiError('no record found with this id', 400)
        res.status(200).json({ status: true, message: "document deleted successfully.", });
    } catch (error) {
        next(error);
    }
}

module.exports = deleteAudio;