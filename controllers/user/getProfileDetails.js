const getProfileDetails = async (req, res, next) => {
    console.log("getProfileDetails -------------------------->", req.body)
    try {
        req.user.password = undefined;
        res.status(200).json({ status: true, message: "Profile details fetched successfully.", data: req.user })
    } catch (error) {
        next(error)
    }
}

module.exports = getProfileDetails