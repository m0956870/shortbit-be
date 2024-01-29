const fs = require("fs");
const multer = require("multer");
const { ApiError } = require("../errorHandler/apiErrorHandler");

const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        if (!fs.existsSync("images")) fs.mkdirSync("images", { recursive: true });
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const multipleImageUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, //10mb
    fileFilter: (req, file, cb) => {
        allowedMimeTypes.includes(file.mimetype)
            ? cb(null, true)
            : cb(new ApiError("Invalid image type!", 400))
    },
}).fields([
    { name: 'avatar_image', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 },
]);

module.exports = multipleImageUpload;