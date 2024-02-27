const User = require("../models/userModel");

const getUserBadge = async (type, id) => {
    if (type === 'user') {
        const user = await User.findById(id);
        console.log(user)
    }

    return 'getUserBadge';
}

module.exports = getUserBadge;

