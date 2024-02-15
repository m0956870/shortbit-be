const Post = require("../../../models/postModel");
const User = require("../../../models/userModel");

const getAllPosts = async (req, res, next) => {
    // console.log("getAllPosts -------------------------->")
    try {
        let { page, limit, user_id } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = {};
        if (user_id) findConditions.posted_by = user_id;

        const allData = await Post.find(findConditions)
        .lean()
        .skip((page * limit) - limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('posted_by')
        .select("-password -is_deleted -updatedAt -otp -otp_expiry -__v")
        let dataCount = await Post.countDocuments(findConditions);

        res.status(200).json({
            status: true,
            message: "post listing",
            total_data: dataCount,
            total_pages: Math.ceil(dataCount / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllPosts;