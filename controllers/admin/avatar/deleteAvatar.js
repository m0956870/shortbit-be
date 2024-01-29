const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Avatar = require("../../../models/avatarModel");

const deleteAvatar = async (req, res, next) => {
    // console.log("deleteAvatar -------------------------->")
    try {
        const deletedData = await Avatar.findByIdAndDelete(req.params.id).lean()
        if(!deletedData) throw new ApiError('no avatar found with this id', 400)
        res.status(200).json({ status: true, message: "avatar deleted successfully.", data: deletedData, });
    } catch (error) {
        next(error);
    }
}

module.exports = deleteAvatar;