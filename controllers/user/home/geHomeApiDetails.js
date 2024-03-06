const HomeBanner = require("../../../models/homeBannerModel");
const User = require("../../../models/userModel");

const geHomeApiDetails = async (req, res, next) => {
    // console.log("geHomeApiDetails -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? Number(page) : 1;
        limit = limit ? Number(limit) : 10;

        const findConditions = { role: 'host', account_status: 'approved' };

        let allData = await User.aggregate([
            { $match: findConditions },
            {
                $facet: {
                    live: [
                        {
                            $match: {
                                is_live_busy: true,
                            },
                        },
                        {
                            $lookup: {
                                from: 'liverooms',
                                localField: 'live_room_id',
                                foreignField: '_id',
                                as: 'room'
                            }
                        }
                    ],
                    active: [
                        {
                            $match: { is_live_busy: false, is_online: true },
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
        const banners = await HomeBanner.find().lean();

        const dataCount = allData[0]?.total_data[0]?.total_data || 0;
        // let data = allData[0]?.totalDataArray

        res.status(200).json({
            status: true,
            message: "host listing",
            total_data: dataCount,
            total_pages: Math.ceil(dataCount / limit),
            data: allData,
            banners
        });
    } catch (error) {
        next(error);
    }
}

module.exports = geHomeApiDetails;