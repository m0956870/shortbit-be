const { default: mongoose } = require("mongoose");
const Notification = require("../../../models/notificationModel");

const getUserNotification = async (req, res, next) => {
    // console.log("getUserNotification", req.body)
    try {
        let { page, limit } = req.query;
        page = Number(page) || 1;
        limit = Number(limit) || 10;

        let rootUser = req.user;

        let allData = await Notification.aggregate([
            {
                $match: { to: rootUser._id }
            },
            {
                $facet: {
                    data: [
                        { $skip: (page * limit) - limit },
                        { $limit: limit },
                        { $sort: { createdAt: -1 } },
                    ],
                    total_data: [
                        { $count: 'total_data' }
                    ]
                }
            }
        ])

        const dataCount = allData[0]?.total_data[0]?.total_data || 0;

        res.status(200).json({
            status: true,
            message: "all listing",
            total_data: dataCount,
            total_pages: Math.ceil(dataCount / limit),
            data: allData[0].data,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getUserNotification;