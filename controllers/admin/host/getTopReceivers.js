const Transaction = require("../../../models/transactionModel");

const getTopReceivers = async (req, res, next) => {
    // console.log("getTopReceivers -------------------------->")
    try {
        let { page, limit, start_date, end_date, host_id } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };
        // if (host_id) findConditions.host_id = host_id;

        const pipeline = [
            {
                $match: { transaction_type: 'credit', transaction_by: 'user', $or: [{ item_type: 'gift' }, { item_type: 'coin' }] },
            },
            {
                $group: {
                    _id: "$user_id",
                    total: { $sum: "$amount" }
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
                $project: {
                    _id: 0,
                    total: 1,
                    user: {
                        name: 1,
                        email: 1,
                        phone_number: 1,
                        balance: 1,
                    }
                }
            }
        ];

        let receivers = await Transaction.aggregate(pipeline)
        res.send(receivers)

        // let dataCount = await User.countDocuments(findConditions);
        // const allData = await User.find(findConditions)
        //     .lean()
        //     .skip((page * limit) - limit)
        //     .limit(limit)
        //     .sort({createdAt: -1 })
        //     .select("-password -is_deleted -updatedAt -otp -otp_expiry -__v")

        // res.status(200).json({
        //     status: true,
        //     message: "all listing",
        //     total_data: dataCount,
        //     total_pages: Math.ceil(dataCount / limit),
        //     data: allData,
        // });
    } catch (error) {
        next(error);
    }
}

module.exports = getTopReceivers;