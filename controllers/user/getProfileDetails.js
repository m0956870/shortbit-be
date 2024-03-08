const getProfileDetails = async (req, res, next) => {
    // console.log("getProfileDetails -------------------------->", req.body)
    try {
        let rootUser = req.user;
        if (rootUser.detail_status === 'incomplete') return res.status(200).json({ status: false, message: "incomplete information!", count: rootUser.detail_count });
   
        await rootUser.populate([{ path: 'interest', match: { is_deleted: false } }, 'live_room_id', 'voice_room_id'])
        rootUser.password = undefined;

        res.status(200).json({ status: true, message: "Profile details fetched successfully.", data: rootUser });
    } catch (error) {
        next(error);
    }
}

module.exports = getProfileDetails;