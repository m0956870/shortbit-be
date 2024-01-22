const getProfileDetails = async (req, res, next) => {
    // console.log("getProfileDetails -------------------------->", req.body)
    try {
        let user = req.user;
        if (user.detail_count !== '0') return res.status(200).json({ status: false, message: "incomplete information!", count: user.detail_count });

        user.password = undefined;
        res.status(200).json({ status: true, message: "Profile details fetched successfully.", data: user })
    } catch (error) {
        next(error)
    }
}

module.exports = getProfileDetails