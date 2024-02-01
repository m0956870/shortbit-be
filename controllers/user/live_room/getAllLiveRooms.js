const HomeBanner = require("../../../models/homeBannerModel");
const LiveRoom = require("../../../models/liveRoomModel");

const getAllLiveRooms = async (req, res, next) => {
    // console.log("getAllLiveRooms -------------------------->", req.user)
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { host_id: { $nin: req.user._id }, status: 'ongoing' };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const allLiveRooms = await LiveRoom.find(findConditions)
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select(" -__v")
            .populate('host_id', 'name profile_image level language')
            .lean()

        const banners = await HomeBanner.find().lean();

        // allLiveRooms.map(room => {
        //     room.earned_coins = 0;
        //     room.level = 'Lvl 5';
        //     room.language = 'English';
        // })

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        shuffleArray(allLiveRooms)

        res.status(200).json({
            status: true,
            message: "live rooms listing",
            total_data: allLiveRooms.length,
            total_pages: Math.ceil(allLiveRooms.length / limit),
            data: allLiveRooms,
            banners
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllLiveRooms;