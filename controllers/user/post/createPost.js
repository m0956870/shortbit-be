const { ApiError } = require('../../../errorHandler/apiErrorHandler');
const Post = require('../../../models/postModel');
const getBaseUrl = require('../../../utils/getBaseUrl');
const videoUpload = require('../../../utils/videoUpload');

const createPost = async (req, res, next) => {
    videoUpload(req, res, async (error) => {
        try {
            if (error) throw new ApiError(error.message, 400);

            let { title, audio_src } = req.body;

            let post = await Post.create({
                title, audio_src,
                posted_by: req.user._id,
                video_src: getBaseUrl() + "/video/" + req.file.filename,
            })
            res.status(200).json({ status: true, message: "post created successfully!", data: post });
        } catch (error) {
            next(error)
        }
    })
}

module.exports = createPost;