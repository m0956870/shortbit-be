const userActiveStatus = async (req, res, next) => {
    // console.log("userActiveStatus", req.body);
    try {
        let { is_online } = req.body;
        let rootUser = req.user;

        if (is_online != undefined && is_online != "undefined") rootUser.is_online = is_online;
        rootUser.save();

        res.status(200).json({ status: true, message: "status updated", data: rootUser });
    } catch (error) {
        next(error);
    }
}

module.exports = userActiveStatus;