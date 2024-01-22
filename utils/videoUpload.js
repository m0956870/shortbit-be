const fs = require("fs");
const multer = require("multer");
const { ApiError } = require("../errorHandler/apiErrorHandler");

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        if (!fs.existsSync("videos")) fs.mkdirSync("videos", { recursive: true });
        cb(null, "videos");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const videoUpload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, //100mb
    fileFilter: (req, file, cb) => {
        file.mimetype.split("/")[0] === "video"
            ? cb(null, true)
            : cb(new ApiError("Invalid video type!", 400))
    },
}).single("video");

module.exports = videoUpload;