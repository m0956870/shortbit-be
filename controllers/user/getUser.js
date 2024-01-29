const User = require("../../models/userModel")

const getUser = async (req, res, next) => {
    // console.log("getUser -------------------------->", req.body)
    try {
        let user = await User.findById(req.params.user_id).select('-password -__v').lean();
        res.status(200).json({ status: true, message: "user profile details.", data: user })
    } catch (error) {
        next(error)
    }
}

module.exports = getUser