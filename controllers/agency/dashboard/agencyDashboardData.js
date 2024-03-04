const { default: mongoose } = require("mongoose");
const Transaction = require("../../../models/transactionModel");
const User = require("../../../models/userModel");

const agencyDashboardData = async (req, res, next) => {
    // console.log("agencyDashboardData -------------------")
    try {
        const host = await User.aggregate([
            {
                $facet: {
                    host: [
                        { $match: { role: 'host', account_status: 'approved', } },
                        { $count: 'totalCount' },
                    ],
                    new_host: [
                        { $match: { role: 'host', account_status: 'approved', createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) } } },
                        { $count: 'totalCount' },
                    ],
                }
            },
            {
                $addFields: {
                    host: { $first: '$host.totalCount' },
                    new_host: { $first: '$new_host.totalCount' },
                }
            },
        ])

        let totalEarning = await Transaction.aggregate([
            {
                $match: {
                    transaction_by: 'admin',
                    transaction_type: 'credit',
                    to_user_id: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $group: {
                    _id: null,
                    total_earning: { $sum: '$amount' }
                }
            }
        ])

        let data = {
            host_count: host[0].host || null,
            new_host_count: host[0].new_host || null,
            total_earning: totalEarning[0].total_earning || null
        }
        res.status(200).json({ status: true, message: "dashboard data", data });
    } catch (error) {
        next(error);
    }
}

module.exports = agencyDashboardData;