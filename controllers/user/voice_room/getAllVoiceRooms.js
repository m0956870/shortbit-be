const User = require("../../../models/userModel");
const VoiceRoom = require("../../../models/voiceRoomModel");

const getAllVoiceRooms = async (req, res, next) => {
    // console.log("getAllVoiceRooms -------------------------->", req.user)
    try {
        let { page, limit } = req.query;
        page = page ? Number(page) : 1;
        limit = limit ? Number(limit) : 10;

        // const findConditions = { host_id: { $nin: req.user._id }, status: 'ongoing' };
        // // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        // const voiceRooms = await VoiceRoom.find(findConditions)
        //     .skip((page * limit) - limit)
        //     .limit(limit)
        //     .sort({ createdAt: -1 })
        //     .select(" -__v")
        //     .populate('host_id', 'name profile_image level language followers_count')
        //     .lean()

        // const dataCount = await VoiceRoom.countDocuments({ host_id: { $nin: req.user._id }, status: 'ongoing' })

        // res.status(200).json({
        //     status: true,
        //     message: "voice rooms listing",
        //     total_data: dataCount,
        //     total_pages: Math.ceil(dataCount / limit),
        //     data: voiceRooms,
        // });

        const findConditions = { role: 'host', account_status: 'approved' };

        let allData = await User.aggregate([
            { $match: findConditions },
            {
                $facet: {
                    live: [
                        {
                            $match: {
                                is_voice_busy: true,
                            },
                        },
                        {
                            $lookup: {
                                from: 'voicerooms',
                                localField: 'voice_room_id',
                                foreignField: '_id',
                                as: 'room'
                            }
                        }
                    ],
                    active: [
                        {
                            $match: { is_voice_busy: false, is_online: true },
                        },
                    ],
                    inactive: [
                        {
                            $match: { is_online: false },
                        },
                    ],
                    totalDataArray: [{ $skip: (page * limit) - limit }, { $limit: limit }],
                    total_data: [
                        {
                            $count: 'total_data'
                        }
                    ]
                },
            },
            // {
            //     $addFields: {
            //         totalDataArray: { $concatArrays: ["$live", "$active", "$inactive"] }
            //     }
            // },
            // {
            //     $project: {
            //         totalDataArray: 1,
            //         total_data: 1
            //     }
            // }
        ])

        const dataCount = allData[0]?.total_data[0]?.total_data || 0;
        // let data = allData[0]?.totalDataArray

        res.status(200).json({
            status: true,
            message: "host listing",
            total_data: dataCount,
            total_pages: Math.ceil(dataCount / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllVoiceRooms;