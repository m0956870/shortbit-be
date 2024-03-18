const Transaction = require("../../../models/transactionModel");

const voiceroomUserRanking = async (req, res, next) => {
    // console.log("voiceroomUserRanking -------------------------->")
    try {
        let { page, limit, user_type, day_count } = req.body;
        page = page ? Number(page) : 1;
        limit = limit ? Number(limit) : 10;

        let startDate = new Date(new Date(new Date().setDate(new Date().getDate() - Number(day_count))).setHours(23, 59, 59)).toLocaleString()

        const pipeline = [];
        let matchObj = { transaction_for: 'audioroom', transaction_by: 'user', $or: [{ item_type: 'gift' }, { item_type: 'coin' }], createdAt: { $gte: new Date(startDate) } }
        if (user_type === 'user') matchObj.transaction_type = 'debit';
        else if (user_type === 'host') matchObj.transaction_type = 'credit';

        pipeline.push(
            { $match: matchObj },
            {
                $group: {
                    _id: "$user_id",
                    total: { $sum: "$amount" },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                }
            },
            {
                $addFields: {
                    user: { $arrayElemAt: ['$user', 0] }
                }
            },
            {
                $facet: {
                    data: [{ $skip: (page * limit) - limit }, { $limit: limit }],
                    total_data: [
                        {
                            $count: 'total_data'
                        }
                    ]
                }
            },
            {
                $addFields: {
                    data: {
                        $sortArray: { input: "$data", sortBy: { total: -1 } }
                    },
                }
            },
            {
                $project: {
                    data: {
                        total: 1,
                        user: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            phone_number: 1,
                            role: 1,
                        }
                    },
                    total_data: 1,
                }
            },
        );


        const allData = await Transaction.aggregate(pipeline)
        const dataCount = allData[0]?.total_data[0]?.total_data || 0;

        if (user_type === 'user') allData[0].data = allData[0].data.filter(elem => elem?.user?.role === "user");
        else if (user_type === 'host') allData[0].data = allData[0].data.filter(elem => elem?.user?.role === "host");

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

module.exports = voiceroomUserRanking;