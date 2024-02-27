const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const WalletPackage = require("../../../models/walletPackageModel");

const deleteWalletPackage = async (req, res, next) => {
    // console.log("deleteWalletPackage -------------------------->", req.params)
    try {
        const deletedData = await WalletPackage.findByIdAndDelete(req.params.id).lean();
        if(!deletedData) throw new ApiError('no record found with this id', 400)
        res.status(200).json({ status: true, message: "wallet package deleted successfully.", data: deletedData, });
    } catch (error) {
        next(error);
    }
}

module.exports = deleteWalletPackage;