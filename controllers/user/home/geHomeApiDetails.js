const HomeBanner = require("../../../models/homeBannerModel");
const User = require("../../../models/userModel");

const geHomeApiDetails = async (req, res, next) => {
    // console.log("geHomeApiDetails -------------------------->")
    try {
        let { page, limit } = req.query;
        // page = page ? page : 1;
        // limit = limit ? limit : 10;

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
                            $match: {
                                service_status: 'active',
                                live_room_id: null
                            },
                        },
                    ],
                    inactive: [
                        {
                            $match: {
                                service_status: 'inactive',
                            },
                        },
                    ],
                    total_data: [
                        {
                            $count: 'total_data'
                        }
                    ]
                },
            },
        ])
        const banners = await HomeBanner.find().lean();

        const dataCount = allData[0]?.total_data[0]?.total_data;

        res.status(200).json({
            status: true,
            message: "host listing",
            total_data: dataCount,
            // total_pages: Math.ceil(dataCount / limit),
            data: allData,
            banners
        });
    } catch (error) {
        next(error);
    }
}

module.exports = geHomeApiDetails;