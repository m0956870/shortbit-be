const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Follow = require("../../../models/followModel");
const LiveRoom = require("../../../models/liveRoomModel");

const getLiveRoom = async (req, res, next) => {
    // console.log("getLiveRoom -------------------------->", req.user)
    try {
        let { id } = req.query;
        if (!id) throw new ApiError("id is required", 400)
        if (!isValidObjectId(id)) throw new ApiError("Invalid ID format", 400);
        let rootUser = req.user;

        const liveRoom = await LiveRoom.findById(id)
            .select(" -__v")
            .populate('host_id', 'name profile_image level language followers_count')
            .lean()

        if (liveRoom) {
            let is_followed = await Follow.findOne({ follower_id: rootUser._id, following_id: liveRoom?.host_id?._id }).lean();
            liveRoom.is_followed = is_followed ? true : false;
        }

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