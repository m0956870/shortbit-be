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
            .lean()

        allLiveRooms.map(room => {
            room.earned_coins = 0;
            room.level = 'Lvl 5';
            room.language = 'English';
        })

        res.status(200).json({
            status: true,
            message: "live rooms listing",
            total_data: allLiveRooms.length,
            total_pages: Math.ceil(allLiveRooms.length / limit),
            data: allLiveRooms,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllLiveRooms;