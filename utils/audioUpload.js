const fs = require("fs");
const multer = require("multer");
const { ApiError } = require("../errorHandler/apiErrorHandler");

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        if (!fs.existsSync("audios")) fs.mkdirSync("audios", { recursive: true });
        cb(null, "audios");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const audioUpload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, //100mb
    fileFilter: (req, file, cb) => {
        file.mimetype.split("/")[0] === "audio"
            ? cb(null, true)
            : cb(new ApiError("Invalid audio type!", 400))
    },
}).single("audio");

module.exports = audioUpload;