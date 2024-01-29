const updateDetails = async (req, res, next) => {
    // console.log("updateDetails -------------------------->", req.body)
    
    // multipleImageUpload
    try {
        res.status(200).json({ status: true, message: "updateDetails.", })
    } catch (error) {
        next(error)
    }
}

module.exports = updateDetails