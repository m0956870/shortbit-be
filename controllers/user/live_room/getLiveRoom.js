const LiveRoom = require("../../../models/liveRoomModel");

const getLiveRoom = async (req, res, next) => {
    // console.log("getLiveRoom -------------------------->", req.user)
    try {
        let { id } = req.query;

        const liveRoom = await LiveRoom.findById(id)
            .select(" -__v")
            .populate('host_id', 'name profile_image level language followers_count')
            .lean()

        res.status(200).json({
            status: true,
            message: "live rooms listing",
            data: liveRoom,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getLiveRoom;