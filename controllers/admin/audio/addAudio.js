const { ApiError } = require('../../../errorHandler/apiErrorHandler');
const Audio = require('../../../models/audioModel');
const getBaseUrl = require('../../../utils/getBaseUrl');
const audioUpload = require('../../../utils/audioUpload');

const addAudio = async (req, res, next) => {
    audioUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);
            if (!req.file) throw new ApiError("audio file is required", 400);

            let { title, audio_src } = req.body;

            let audio = await Audio.create({
                title,
                posted_by: req.user._id,
                audio_src: getBaseUrl() + "/audio/" + req.file.filename,
            })
            res.status(200).json({ status: true, message: "audio added successfully!", data: audio });
        } catch (error) {
            next(error)
        }
    })
}

module.exports = addAudio;