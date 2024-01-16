const userRoute = require("express").Router();
const userAuth = require("../middlewares/userAuth");
const loginUser = require("../controllers/user/auth/loginUser");
const signupUser = require("../controllers/user/auth/signupUser");
const detailStatus = require("../controllers/user/detailStatus");
const updateRegisterDetails = require("../controllers/user/updateRegisterDetails");
const getProfileDetails = require("../controllers/user/getProfileDetails");

userRoute.route('/').post(signupUser);
userRoute.post('/login', loginUser);

userRoute.get('/detail_status', userAuth, detailStatus);
userRoute.post('/update_detail_status', userAuth, updateRegisterDetails);

userRoute.get('/get_profile', userAuth, getProfileDetails);

module.exports = userRoute;