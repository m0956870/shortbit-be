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
const followUser = require("../controllers/user/follow/followUser");
const likePost = require("../controllers/user/like/likePost");
const sharePost = require("../controllers/user/share/sharePost");
const viewPost = require("../controllers/user/view/viewPost");
const createComment = require("../controllers/user/comment/createComment");
const createLiveRoom = require("../controllers/user/live_room/host/createLiveRoom");
const endLiveRoom = require("../controllers/user/live_room/host/endLiveRoom");
const joinLiveRoom = require("../controllers/user/live_room/user/joinLiveRoom");
const leaveLiveRoom = require("../controllers/user/live_room/user/leaveLiveRoom");
const getAllLiveRooms = require("../controllers/user/live_room/getAllLiveRooms");
const ongoingLiveRoom = require("../controllers/user/live_room/host/ongoingLiveRoom");
const getAllInterest = require("../controllers/user/interest/getAllInterest");
const sendGift = require("../controllers/user/transaction/user/sendGift");
const giftListing = require("../controllers/user/gift/giftListing");
const getAllAvatar = require("../controllers/user/avatar/getAllAvatar");
const updateDetails = require("../controllers/user/updateDetails");

userRoute.route('/').post(signupUser).get(userAuth, getProfileDetails).patch(userAuth, updateDetails)

// auth
userRoute.post('/login', loginUser);
userRoute.post('/verify_signup_otp', verifySignupOTP);
userRoute.route('/interest').get(getAllInterest)
userRoute.route('/detail_status').patch(userAuth, updateRegisterDetails);

// user interactivity
userRoute.route('/follow/:following_id').get(userAuth, followUser)

// post interactivity
userRoute.route('/post').post(userAuth, createPost).get(userAuth, getAllPost)
userRoute.route('/like/:post_id').get(userAuth, likePost)
userRoute.route('/view/:post_id').get(userAuth, viewPost)
userRoute.route('/share').post(userAuth, sharePost)
userRoute.route('/comment').post(userAuth, createComment)

// host
userRoute.post('/host_request', hostRequest);

// live & video chat module
// host
userRoute.route('/live_room').get(userAuth, getAllLiveRooms).post(userAuth, createLiveRoom).patch(userAuth, endLiveRoom)
userRoute.route('/ongoing_live_room').get(userAuth, ongoingLiveRoom);


// USER - live room
userRoute.route('/join_room').post(userAuth, joinLiveRoom)
userRoute.route('/leave_room').post(userAuth, leaveLiveRoom)

// gift
userRoute.post('/send_gift', userAuth, sendGift);
userRoute.route('/gift').get(userAuth, giftListing);

// avatar
userRoute.route('/avatar').get(userAuth, getAllAvatar);

module.exports = userRoute;