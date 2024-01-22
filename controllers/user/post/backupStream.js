const fs = require('fs');
const path = require('path');

const multer = require('multer');
const { ApiError } = require('../../../errorHandler/apiErrorHandler');
// const upload = multer({ dest: 'videos/' }).single('video')
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        if (!fs.existsSync("videos")) fs.mkdirSync("videos", { recursive: true });
        cb(null, "videos");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const imageUpload = multer({
    storage,
}).single("video");

const uploadFile = (req, filePath) => {
    return new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(filePath);
        // With the open - event, data will start being written
        // from the request to the stream's destination path
        stream.on('open', () => {
            console.log('Stream open ...  0.00%');
            req.pipe(stream);
        });

        // Drain is fired whenever a data chunk is written.
        // When that happens, print how much data has been written yet.
        stream.on('drain', () => {
            const written = parseInt(stream.bytesWritten);
            const total = parseInt(req.headers['content-length']);
            const pWritten = ((written / total) * 100).toFixed(2);
            console.log(`Processing  ...  ${pWritten}% done`);
        });

        // When the stream is finished, print a final message
        // Also, resolve the location of the file to calling function
        stream.on('close', () => {
            console.log('Processing  ...  100%');
            resolve(filePath);
        });
        // If something goes wrong, reject the primise
        stream.on('error', err => {
            console.error(err);
            reject(err);
        });
    });
};

const createPost = async (req, res, next) => {
    imageUpload(req, res, async (error) => {
        if (error) throw new ApiError(error.message, 400);

        console.log("createPost -------------------------->", req.file)
        try {
            // const filePath = path.join("videos", req.file.originalname);
            // console.log("first", filePath)
            // uploadFile(req, filePath)
            //     .then(path => res.send({ status: 'success', path }))
            //     .catch(err => res.send({ status: 'error', err }));
            res.send()
        } catch (error) {
            next(error)
        }
    })
}

module.exports = createPost