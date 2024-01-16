const jwt = require("jsonwebtoken");
const { ApiError } = require("../errorHandler/apiErrorHandler");

const verifyJWT = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        throw new ApiError("Access token invalid!", 401);
    }
}

module.exports = verifyJWT;