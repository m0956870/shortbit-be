class ApiError extends Error {
    constructor(message, statusCode, data) {
        console.log("cons", message, statusCode, data)
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}

const finalErrorHandler = (error, req, res, next) => {
    const { statusCode = 500, message, stack, data } = error;
    res.status(statusCode);
    if (statusCode === 500) return res.json({ status: false, message, stack, error });
    res.json({ status: false, message, data });
}

module.exports = { ApiError, finalErrorHandler }