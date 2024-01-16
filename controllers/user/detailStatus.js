const User = require("../../models/userModel");

const detailStatus = async (req, res, next) => {
    // console.log("detailStatus", req.body);
    try {
        let count = 5;
        if (req.user.detail_status === 'incomplete') {
            if (!req.user.gender) --count;
            if (!req.user.age) --count;
            if (!req.user.interest.length) --count;
            if (!req.user.profile_image) --count;
            if (!req.user.location.name) --count;
            return res.status(200).json({ status: false, message: "incomplete information!", count: Math.abs(count - 5) });
        }
        res.status(200).json({ status: true, message: "information is complete." });
    } catch (error) {
        next(error);
    }
}

module.exports = detailStatus;