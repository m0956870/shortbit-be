const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const multipleImageUpload = require("../../../utils/multipleImageUpload");
const getBaseUrl = require("../../../utils/getBaseUrl");
const WalletPackage = require("../../../models/walletPackageModel");

const updateWalletPackage = async (req, res, next) => {
    // console.log("updateWalletPackage -------------------------->", req.body);
    multipleImageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            let { id, name, amount, coin, add_on_package } = req.body;
            if (!id) throw new ApiError("ID is required!", 400);
            if (!isValidObjectId(id)) throw new ApiError("Invalid ID!", 400);

            let updatedObj = {};
            if (name) updatedObj.name = name;
            if (amount) updatedObj.amount = amount;
            if (coin) updatedObj.coin = coin;
            if (add_on_package) updatedObj.add_on_package = add_on_package;
            if (req.files["image"]) updatedObj.package_image = getBaseUrl() + "/image/" + req.files["image"][0].filename;


            let updatedRecord = await WalletPackage.findByIdAndUpdate(id, updatedObj, { new: true }).lean();
            if (!updatedRecord) throw new ApiError("No document found with this ID", 404);
            res.status(200).json({ status: true, message: "wallet package updated sucessfully.", data: updatedRecord });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = updateWalletPackage;