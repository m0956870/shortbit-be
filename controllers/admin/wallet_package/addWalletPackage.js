const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const WalletPackage = require("../../../models/walletPackageModel");
const getBaseUrl = require("../../../utils/getBaseUrl");
const multipleImageUpload = require("../../../utils/multipleImageUpload");

const addWalletPackage = async (req, res, next) => {
    // console.log("addWalletPackage -------------------------->", req.body);
    multipleImageUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            const { name, amount, coin, add_on_package } = req.body;
            // if (!name) throw new ApiError("name is required!", 400);
            if (!amount) throw new ApiError("amount is required!", 400);
            if (!coin) throw new ApiError("coin is required!", 400);
            if (!add_on_package) throw new ApiError("add_on_package is required!", 400);

            let package_image;
            if (req.files["image"]) package_image = getBaseUrl() + "/image/" + req.files["image"][0].filename;

            const existingRecord = await WalletPackage.findOne({ amount }).lean();
            if (existingRecord) throw new ApiError("wallet package already exist!", 400);

            const newRecord = await WalletPackage.create({ name, package_image, amount, coin, add_on_package });
            res.status(201).json({ status: true, message: "wallet package created successfully", data: newRecord });
        } catch (error) {
            next(error);
        }
    })
}

module.exports = addWalletPackage;