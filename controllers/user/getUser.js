const { ApiError } = require("../../errorHandler/apiErrorHandler");
const User = require("../../models/userModel")

const getUser = async (req, res, next) => {
    // console.log("getUser -------------------------->", req.body)
    try {
        let user = await User.findById(req.params.user_id)
            .lean()
            .populate('interest')
            .select('-password -__v')

        if (!user) throw new ApiError('user not found', 404);
        res.status(200).json({ status: true, message: "user profile details.", data: user });
    } catch (error) {
        next(error);
    }
}

module.exports = getUser;