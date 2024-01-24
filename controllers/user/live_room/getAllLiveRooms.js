const LiveRoom = require("../../../models/liveRoomModel");

const getAllLiveRooms = async (req, res, next) => {
    // console.log("getAllLiveRooms -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { status: 'ongoing' };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const allLiveRooms = await LiveRoom.find(findConditions)
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select(" -__v")
            .populate('host_id', 'name profile_image')

        if (allLiveRooms.length === 0) res.status(200).json({ status: true, message: "no live hosts found!" })
        res.status(200).json({
            status: true,
            message: "All live rooms fetched successfully.",
            total_posts: allLiveRooms.length,
            total_pages: Math.ceil(allLiveRooms.length / limit),
            data: allLiveRooms,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllLiveRooms;