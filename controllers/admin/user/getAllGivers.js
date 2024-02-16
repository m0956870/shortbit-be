const Transaction = require("../../../models/transactionModel");

const getAllGivers = async (req, res, next) => {
    // console.log("getAllGivers -------------------------->")
    try {
        let { page, limit, start_date, end_date, user_id } = req.query;
        page = page ? Number(page) : 1;
        limit = limit ? Number(limit) : 10;

        const pipeline = [];
        const matchObj = { transaction_type: 'debit', transaction_by: 'user', $or: [{ item_type: 'gift' }, { item_type: 'coin' }] }

        if (user_id) matchObj.user_id = user_id;
        if (start_date) matchObj.createdAt = { $gte: new Date(start_date) };
        if (end_date) matchObj.createdAt = { ...matchObj.createdAt, $lte: new Date(end_date) };

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
                        }
                    },
                    total_data: 1,
                }
            },
        );


        const allData = await Transaction.aggregate(pipeline)
        const dataCount = allData[0]?.total_data[0]?.total_data;

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

module.exports = getAllGivers;