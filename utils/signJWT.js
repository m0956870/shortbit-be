const jwt = require("jsonwebtoken");

const signJWT = (_id, duration) => {
    try {
        if (duration) return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: duration });
        return jwt.sign({ _id }, process.env.JWT_SECRET_KEY);
    } catch (error) {
        console.log(error);
    }
}

module.exports = signJWT;