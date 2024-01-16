const userRoute = require("express").Router();
const userAuth = require("../middlewares/userAuth");
// controller
const loginUser = require("../controllers/user/auth/loginUser");
const signupUser = require("../controllers/user/auth/signupUser");
const detailStatus = require("../controllers/user/detailStatus");
const updateRegisterDetails = require("../controllers/user/updateRegisterDetails");
const getProfileDetails = require("../controllers/user/getProfileDetails");

userRoute.post('/login', loginUser);
userRoute.route('/').post(signupUser).get(userAuth, getProfileDetails)

userRoute.route('/detail_status').get(userAuth, detailStatus).patch(userAuth, updateRegisterDetails);

module.exports = userRoute;