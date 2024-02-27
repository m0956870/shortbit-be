const WalletPackage = require("../../../models/walletPackageModel");

const getAllWalletPackage = async (req, res, next) => {
    // console.log("getAllWalletPackage -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const allData = await WalletPackage.find(findConditions).lean()
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-__v")
            
        let dataCount = await WalletPackage.countDocuments(findConditions)

        res.status(200).json({
            status: true,
            message: "wallet package listing",
            total_data: dataCount,
            total_pages: Math.ceil(dataCount / limit),
            data: allData,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllWalletPackage;