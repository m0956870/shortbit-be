const unspecifiedRouteHandler = async (req, res) => {
    res.status(200).json({ status: true, message: "Route not found! Please check end-point or method" });
}

module.exports = unspecifiedRouteHandler;