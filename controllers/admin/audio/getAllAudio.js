const Audio = require("../../../models/audioModel");

const getAllAudio = async (req, res, next) => {
    // console.log("getAllAudio -------------------------->")
    try {
        let { page, limit } = req.query;
        page = page ? page : 1;
        limit = limit ? limit : 10;

        const findConditions = { is_deleted: false, status: true };
        // if (type) findConditions.type = { $regex: new RegExp(type, "i") };

        const audio = await Audio.find(findConditions)
            .skip((page * limit) - limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-is_deleted -__v")

        if (audio.length === 0) res.status(200).json({ status: true, message: "no audio found!", data: [] })
        res.status(200).json({
            status: true,
            message: "All audio fetched successfully.",
            total_posts: audio.length,
            total_pages: Math.ceil(audio.length / limit),
            data: audio,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = getAllAudio;