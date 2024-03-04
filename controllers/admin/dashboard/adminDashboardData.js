const { default: mongoose } = require("mongoose");
const Agency = require("../../../models/agencyModel");
const Transaction = require("../../../models/transactionModel");
const User = require("../../../models/userModel");

const adminDashboardData = async (req, res, next) => {
    // console.log("adminDashboardData -------------------")
    try {
        const agencies = await Agency.aggregate([
            { $count: 'totalCount' },
        ])
        const host = await User.aggregate([
            { $match: { role: 'host', account_status: 'approved' } },
            { $count: 'totalCount' },
        ])
        const user = await User.aggregate([
            {
                $facet: {
                    user: [
                        { $match: { role: 'user', } },
                        { $count: 'totalCount' },
                    ],
                    new_user: [
                        { $match: { role: 'user', createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) } } },
                        { $count: 'totalCount' },
                    ],
                }
            },
            {
                $addFields: {
                    user: { $first: '$user.totalCount' },
                    new_user: { $first: '$new_user.totalCount' },
                }
            }
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
            agency_count: agencies[0].totalCount || null,
            host_count: host[0].totalCount || null,
            user_count: user[0].user || null,
            new_user_count: user[0].new_user || null,
            total_earning: totalEarning[0].total_earning || null

        }
        res.status(200).json({ status: true, message: "dashboard data.", data });
    } catch (error) {
        next(error);
    }
}

module.exports = adminDashboardData;