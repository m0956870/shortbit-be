const userRoute = require("express").Router();
const userAuth = require("../middlewares/userAuth");
// controller
const loginUser = require("../controllers/user/auth/loginUser");
const signupUser = require("../controllers/user/auth/signupUser");
const updateRegisterDetails = require("../controllers/user/updateRegisterDetails");
const getProfileDetails = require("../controllers/user/getProfileDetails");
const verifySignupOTP = require("../controllers/user/auth/verifySignupOTP");
const hostRequest = require("../controllers/host/hostRequest");
const createPost = require("../controllers/user/post/createPost");
const getAllPost = require("../controllers/user/post/getAllPost");

userRoute.post('/login', loginUser);
userRoute.post('/verify_signup_otp', verifySignupOTP);
userRoute.route('/').post(signupUser).get(userAuth, getProfileDetails);

userRoute.route('/detail_status').patch(userAuth, updateRegisterDetails);

userRoute.route('/post').post(userAuth, createPost).get(userAuth, getAllPost)

// host
userRoute.post('/host_request', hostRequest);

module.exports = userRoute;