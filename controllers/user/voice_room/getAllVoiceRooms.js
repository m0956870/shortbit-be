const VoiceRoom = require("../../../models/voiceRoomModel");

const getAllVoiceRooms = async (req, res, next) => {
    // console.log("getAllVoiceRooms -------------------------->", req.user)
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { host_id: { $nin: req.user._id }, status: 'ongoing' };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const voiceRooms = await VoiceRoom.find(findConditions)
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select(" -__v")
            .populate('host_id', 'name profile_image level language followers_count')
            .lean()

        const dataCount = await VoiceRoom.countDocuments({ host_id: { $nin: req.user._id }, status: 'ongoing' })

        res.status(200).json({
            status: true,
            message: "voice rooms listing",
            total_data: dataCount,
            total_pages: Math.ceil(dataCount / limit),
            data: voiceRooms,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllVoiceRooms;